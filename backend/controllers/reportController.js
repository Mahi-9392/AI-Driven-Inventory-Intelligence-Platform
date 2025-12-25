import Forecast from '../models/Forecast.js';
import InventoryData from '../models/InventoryData.js';
import mongoose from 'mongoose';

export const generatePDFReport = async (req, res, next) => {
  try {
    // Dynamic import for jsPDF to handle ES module compatibility
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
    
    const userId = req.userId;
    const { productId, region, startDate, endDate } = req.query;

    // Convert userId to ObjectId for consistent queries
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Build query
    const forecastQuery = { userId: userObjectId };
    const dataQuery = { userId: userObjectId };

    if (productId) {
      forecastQuery.productId = productId;
      dataQuery.productId = productId;
    }
    if (region) {
      forecastQuery.region = region;
      dataQuery.region = region;
    }

    // Get forecasts (use aggregation to get latest per product/region)
    let forecasts = await Forecast.aggregate([
      { $match: forecastQuery },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { productId: '$productId', region: '$region' },
          latestForecast: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$latestForecast' } },
      { $sort: { createdAt: -1 } },
      { $limit: 50 }
    ]);

    // If no forecasts found with ObjectId, try with string userId as fallback
    if (forecasts.length === 0 && typeof userId === 'string' && !mongoose.Types.ObjectId.isValid(userId)) {
      const forecastQueryStr = { ...forecastQuery, userId: userId.toString() };
      forecasts = await Forecast.aggregate([
        { $match: forecastQueryStr },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: { productId: '$productId', region: '$region' },
            latestForecast: { $first: '$$ROOT' }
          }
        },
        { $replaceRoot: { newRoot: '$latestForecast' } },
        { $sort: { createdAt: -1 } },
        { $limit: 50 }
      ]);
    }

    // Get recent inventory data
    if (startDate || endDate) {
      dataQuery.date = {};
      if (startDate) dataQuery.date.$gte = new Date(startDate);
      if (endDate) dataQuery.date.$lte = new Date(endDate);
    }

    let inventoryData = await InventoryData.find(dataQuery)
      .sort({ date: -1 })
      .limit(100)
      .lean();

    // If no inventory data found with ObjectId, try with string userId as fallback
    if (inventoryData.length === 0 && typeof userId === 'string' && !mongoose.Types.ObjectId.isValid(userId)) {
      const dataQueryStr = { ...dataQuery, userId: userId.toString() };
      inventoryData = await InventoryData.find(dataQueryStr)
        .sort({ date: -1 })
        .limit(100)
        .lean();
    }

    // Check if we have any data
    if (forecasts.length === 0 && inventoryData.length === 0) {
      return res.status(404).json({
        message: 'No forecast or inventory data found to generate report'
      });
    }

    // Generate PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with gradient-like styling
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventory Intelligence', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Demand Forecasting Report', pageWidth / 2, 28, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    // Report metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 12;

    // Executive Summary Section
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 8;

    // Summary box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, yPosition, pageWidth - 40, 35, 3, 3, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const highRiskCount = forecasts.filter(f => f.riskLevel === 'HIGH').length;
    const mediumRiskCount = forecasts.filter(f => f.riskLevel === 'MEDIUM').length;
    const lowRiskCount = forecasts.filter(f => f.riskLevel === 'LOW').length;

    doc.setTextColor(30, 30, 30);
    doc.text(`Total Forecasts: ${forecasts.length}`, 25, yPosition + 7);
    
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text(`High Risk Items: ${highRiskCount}`, 25, yPosition + 14);
    
    doc.setTextColor(217, 119, 6); // Amber-600
    doc.text(`Medium Risk Items: ${mediumRiskCount}`, 25, yPosition + 21);
    
    doc.setTextColor(5, 150, 105); // Emerald-600
    doc.text(`Low Risk Items: ${lowRiskCount}`, 25, yPosition + 28);
    
    yPosition += 45;
    doc.setTextColor(0, 0, 0);

    // Forecast Details Section
    if (forecasts.length > 0) {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Forecast Details', 20, yPosition);
      yPosition += 12;

      doc.setFontSize(10);
      forecasts.slice(0, 15).forEach((forecast, index) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        // Safety checks for forecast properties
        const productName = forecast.productName || 'Unknown Product';
        const region = forecast.region || 'Unknown Region';
        const riskLevel = forecast.riskLevel || 'LOW';
        const predictedDemand = forecast.predictedDemand || 0;
        const currentStock = forecast.currentStock || 0;
        const confidenceScore = forecast.confidenceScore || 0;
        const reasoning = forecast.reasoning || 'No reasoning available';
        const recommendedAction = forecast.recommendedAction || 'No action recommended';
        const deficit = predictedDemand - currentStock;

        // Forecast card background
        const cardHeight = 60;
        if (riskLevel === 'HIGH') {
          doc.setFillColor(254, 242, 242); // Red-50
          doc.setDrawColor(254, 202, 202); // Red-300
        } else if (riskLevel === 'MEDIUM') {
          doc.setFillColor(255, 251, 235); // Amber-50
          doc.setDrawColor(253, 230, 138); // Amber-300
        } else {
          doc.setFillColor(236, 253, 245); // Emerald-50
          doc.setDrawColor(167, 243, 208); // Emerald-300
        }
        doc.roundedRect(20, yPosition - 5, pageWidth - 40, cardHeight, 3, 3, 'FD');
        doc.setLineWidth(0.5);
        doc.roundedRect(20, yPosition - 5, pageWidth - 40, cardHeight, 3, 3, 'D');

        // Title with risk badge
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        if (riskLevel === 'HIGH') doc.setTextColor(220, 38, 38);
        else if (riskLevel === 'MEDIUM') doc.setTextColor(217, 119, 6);
        else doc.setTextColor(5, 150, 105);
        
        const titleText = `${productName} • ${region}`;
        doc.text(titleText, 25, yPosition + 5);
        
        // Risk badge
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const badgeText = `${riskLevel} RISK`;
        const badgeWidth = doc.getTextWidth(badgeText) + 4;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 25 - badgeWidth, yPosition, badgeWidth, 6, 1, 1, 'F');
        doc.text(badgeText, pageWidth - 25 - badgeWidth + 2, yPosition + 4);
        
        yPosition += 10;

        // Key metrics in a grid
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Predicted Demand', 25, yPosition);
        doc.text('Current Stock', 100, yPosition);
        doc.text('Gap', 160, yPosition);
        doc.text('Confidence', 200, yPosition);
        
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 30, 30);
        doc.text(`${predictedDemand.toFixed(0)}`, 25, yPosition);
        
        if (deficit > 0) doc.setTextColor(220, 38, 38);
        else doc.setTextColor(30, 30, 30);
        doc.text(`${currentStock.toFixed(0)}`, 100, yPosition);
        
        if (deficit > 0) doc.setTextColor(220, 38, 38);
        else doc.setTextColor(5, 150, 105);
        doc.text(`${deficit > 0 ? '+' : ''}${deficit.toFixed(0)}`, 160, yPosition);
        
        doc.setTextColor(30, 30, 30);
        doc.text(`${confidenceScore.toFixed(1)}%`, 200, yPosition);
        
        yPosition += 8;

        // AI Reasoning
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('AI Reasoning:', 25, yPosition);
        yPosition += 5;
        
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        const maxWidth = pageWidth - 50;
        const reasoningLines = doc.splitTextToSize(reasoning.length > 150 ? reasoning.substring(0, 150) + '...' : reasoning, maxWidth);
        reasoningLines.forEach(line => {
          doc.text(line, 25, yPosition);
          yPosition += 4;
        });
        
        yPosition += 2;

        // Recommended Action
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        if (riskLevel === 'HIGH') doc.setTextColor(220, 38, 38);
        else if (riskLevel === 'MEDIUM') doc.setTextColor(217, 119, 6);
        else doc.setTextColor(5, 150, 105);
        doc.text('Recommended Action:', 25, yPosition);
        yPosition += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        const actionLines = doc.splitTextToSize(recommendedAction, maxWidth);
        actionLines.forEach(line => {
          doc.text(line, 25, yPosition);
          yPosition += 4;
        });
        
        yPosition += 8; // Gap between forecasts
      });
    }

    // Generate PDF buffer - use 'arraybuffer' output and convert properly
    const pdfOutput = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfOutput);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${Date.now()}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    // If it's a jsPDF error, provide more context
    if (error.message && error.message.includes('jsPDF')) {
      return res.status(500).json({
        message: 'Failed to generate PDF report',
        error: 'PDF generation library error. Please check if forecasts contain valid data.'
      });
    }
    next(error);
  }
};

