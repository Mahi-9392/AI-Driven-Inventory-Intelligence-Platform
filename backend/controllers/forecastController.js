import Forecast from '../models/Forecast.js';
import { computeAnalytics } from './analyticsController.js';
import Groq from 'groq-sdk';
import mongoose from 'mongoose';

// Lazy initialization of Groq client
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
};

export const generateForecast = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, productName, region } = req.body;

    if (!productId || !productName || !region) {
      return res.status(400).json({ 
        message: 'productId, productName, and region are required' 
      });
    }

    // DATA LIFECYCLE NOTE: 
    // This forecast is generated from the latest data snapshot only.
    // All previous forecasts are deleted when a new CSV is uploaded,
    // ensuring forecasts always reflect the current business state.

    // Compute deterministic analytics from latest data snapshot
    let analytics;
    try {
      analytics = await computeAnalytics(userId, productId, region);
      console.log('Analytics computed successfully:', {
        movingAverage: analytics.movingAverage,
        dataPoints: analytics.dataPoints,
        currentStock: analytics.currentStock
      });
    } catch (error) {
      console.error('Analytics computation error:', error);
      return res.status(400).json({ 
        message: error.message || 'Failed to compute analytics. Please ensure you have uploaded CSV data for this product and region.',
        error: error.message 
      });
    }

    // Convert userId to ObjectId for consistent queries
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    // Construct AI prompt
    const prompt = constructAIPrompt(productName, region, analytics);

    // Call Groq API
    let aiResponse;
    try {
      const groq = getGroqClient();
      
      // Use llama-3.1-8b-instant (fast and reliable, always available)
      // Lower temperature (0.3) for more consistent, deterministic results
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.3, // Reduced from 0.7 for more consistent results
        max_tokens: 2000
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        aiResponse = parseAIResponse(content);
      } else {
        throw new Error('Unexpected response format from Groq API');
      }
    } catch (error) {
      console.error('Groq API error:', error);
      return res.status(500).json({ 
        message: 'Failed to generate AI forecast',
        error: error.message 
      });
    }

    // Apply business rules
    const currentStock = analytics.currentStock;
    const predictedDemand = aiResponse.predictedDemand;

    // Business rule: predictedDemand > stockAvailable = HIGH risk
    let riskLevel = aiResponse.riskLevel;
    let recommendedAction = aiResponse.recommendedAction;

    if (predictedDemand > currentStock) {
      riskLevel = 'HIGH';
      recommendedAction = `URGENT: Reorder required. Predicted demand (${predictedDemand.toFixed(0)}) exceeds current stock (${currentStock.toFixed(0)}). ${recommendedAction}`;
    }

    // Check if forecast already exists (update instead of creating duplicate)
    const existingForecastDoc = await Forecast.findOne({
      userId: userObjectId,
      productId,
      region
    }).sort({ createdAt: -1 });

    let forecast;
    if (existingForecastDoc) {
      // Update existing forecast instead of creating duplicate
      existingForecastDoc.currentStock = currentStock;
      existingForecastDoc.predictedDemand = predictedDemand;
      existingForecastDoc.confidenceScore = aiResponse.confidenceScore;
      existingForecastDoc.riskLevel = riskLevel;
      existingForecastDoc.reasoning = aiResponse.reasoning;
      existingForecastDoc.recommendedAction = recommendedAction;
      existingForecastDoc.analytics = {
        movingAverage: analytics.movingAverage,
        growthRate: analytics.growthRate,
        salesVelocity: analytics.salesVelocity,
        regionalVolatility: analytics.regionalVolatility
      };
      existingForecastDoc.metadata.forecastDate = new Date();
      existingForecastDoc.metadata.dataPointsUsed = analytics.dataPoints;
      await existingForecastDoc.save();
      forecast = existingForecastDoc;
      console.log(`Updated existing forecast for ${productId} in ${region}`);
    } else {
      // Create new forecast
      forecast = new Forecast({
        userId: userObjectId,
        productId,
        productName,
        region,
        currentStock,
        predictedDemand,
        confidenceScore: aiResponse.confidenceScore,
        riskLevel,
        reasoning: aiResponse.reasoning,
        recommendedAction,
        analytics: {
          movingAverage: analytics.movingAverage,
          growthRate: analytics.growthRate,
          salesVelocity: analytics.salesVelocity,
          regionalVolatility: analytics.regionalVolatility
        },
        metadata: {
          forecastDate: new Date(),
          dataPointsUsed: analytics.dataPoints
        }
      });
      await forecast.save();
      console.log(`Created new forecast for ${productId} in ${region}`);
    }

    const message = existingForecastDoc 
      ? 'Forecast updated successfully (replaced previous forecast for this product/region)'
      : 'Forecast generated successfully';
    
    res.json({
      message,
      forecast: forecast.toObject()
    });
  } catch (error) {
    next(error);
  }
};

export const getForecasts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, region, riskLevel, limit = 100 } = req.query;

    // Convert userId to ObjectId
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const query = { userId: userObjectId };
    if (productId) query.productId = productId;
    if (region) query.region = region;
    if (riskLevel) query.riskLevel = riskLevel;

    // Get all forecasts, then group by productId+region and keep only the latest
    let forecasts = await Forecast.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 2) // Get more to filter duplicates
      .select('-userId -__v')
      .lean();

    // Group by productId+region and keep only the most recent for each combination
    const forecastMap = new Map();
    forecasts.forEach(forecast => {
      const key = `${forecast.productId}-${forecast.region}`;
      const existing = forecastMap.get(key);
      if (!existing || new Date(forecast.createdAt) > new Date(existing.createdAt)) {
        forecastMap.set(key, forecast);
      }
    });

    // Convert back to array and sort by creation date
    forecasts = Array.from(forecastMap.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({ forecasts, count: forecasts.length });
  } catch (error) {
    console.error('getForecasts error:', error);
    next(error);
  }
};

export const getForecastById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const forecast = await Forecast.findOne({ _id: id, userId })
      .select('-userId -__v');

    if (!forecast) {
      return res.status(404).json({ message: 'Forecast not found' });
    }

    res.json({ forecast });
  } catch (error) {
    next(error);
  }
};

function constructAIPrompt(productName, region, analytics) {
  return `You are a business inventory analyst with expertise in demand forecasting and supply chain management. Analyze the following inventory data and provide a professional forecast.

Product: ${productName}
Region: ${region}

Analytics Summary:
- 7-Day Moving Average: ${analytics.movingAverage.toFixed(2)} units/day
- Growth Rate: ${analytics.growthRate.toFixed(2)}%
- Sales Velocity: ${analytics.salesVelocity.toFixed(2)} units/day
- Regional Volatility: ${analytics.regionalVolatility.toFixed(2)}%
- Current Stock: ${analytics.currentStock} units
- Historical Data Points: ${analytics.dataPoints}

Based on these deterministic signals, provide your analysis as a JSON object with exactly these fields:
{
  "predictedDemand": <number representing expected demand for next period>,
  "confidenceScore": <number 0-100 representing confidence in the prediction>,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "reasoning": "<plain English explanation of your analysis, trends observed, and factors considered>",
  "recommendedAction": "<clear, actionable recommendation in plain English>"
}

Consider:
- The moving average indicates recent sales trends
- Growth rate shows whether demand is increasing or decreasing
- Sales velocity indicates the pace of sales
- Volatility indicates demand stability
- Current stock levels relative to predicted demand

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no code blocks, no additional text. Just the JSON object.`;
}

function parseAIResponse(text) {
  // Try to extract JSON from the response
  let jsonText = text.trim();
  
  // Remove markdown code blocks if present
  jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Try to find JSON object
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonText = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonText);
    
    // Validate required fields
    if (typeof parsed.predictedDemand !== 'number') {
      throw new Error('predictedDemand must be a number');
    }
    if (typeof parsed.confidenceScore !== 'number' || parsed.confidenceScore < 0 || parsed.confidenceScore > 100) {
      throw new Error('confidenceScore must be a number between 0 and 100');
    }
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(parsed.riskLevel)) {
      throw new Error('riskLevel must be LOW, MEDIUM, or HIGH');
    }
    if (!parsed.reasoning || typeof parsed.reasoning !== 'string') {
      throw new Error('reasoning must be a non-empty string');
    }
    if (!parsed.recommendedAction || typeof parsed.recommendedAction !== 'string') {
      throw new Error('recommendedAction must be a non-empty string');
    }

    return parsed;
  } catch (error) {
    // Fallback response if parsing fails
    console.error('Failed to parse AI response:', error);
    return {
      predictedDemand: 0,
      confidenceScore: 0,
      riskLevel: 'MEDIUM',
      reasoning: 'Unable to parse AI response. Please review data manually.',
      recommendedAction: 'Review inventory data and generate forecast manually.'
    };
  }
}

