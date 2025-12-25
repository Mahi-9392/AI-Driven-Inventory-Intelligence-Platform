import { useState } from 'react';
import { inventoryRequest } from '../../request/inventoryRequest';

const CSVUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
        setMessage('');
      } else {
        setError('Please select a CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setMessage('');
      
      const response = await inventoryRequest.uploadCSV(file);
      
      const inserted = response.data.recordsInserted || 0;
      const updated = response.data.recordsUpdated || 0;
      const total = inserted + updated;
      
      setMessage(`Successfully processed ${total} records (${inserted} new, ${updated} updated)`);
      setFile(null);
      
      const fileInput = document.getElementById('csv-upload');
      if (fileInput) fileInput.value = '';
      
      if (onUploadSuccess) {
        onUploadSuccess();
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.message || 'Upload failed. Please check your CSV format and try again.';
      setError(errorMsg);
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        setError(`${errorMsg}\n\nDetails: ${err.response.data.errors.slice(0, 3).join(', ')}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-indigo-50/30 to-white border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="heading-3">Upload CSV Data</h2>
          <p className="text-xs text-gray-500 mt-0.5">Import historical sales and inventory data</p>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs font-semibold text-blue-900 mb-2">Required CSV Format:</p>
        <p className="text-xs text-blue-800 leading-relaxed">
          Your CSV must include these columns: <span className="font-mono font-semibold">productId</span>, <span className="font-mono font-semibold">productName</span>, <span className="font-mono font-semibold">region</span>, <span className="font-mono font-semibold">date</span>, <span className="font-mono font-semibold">unitsSold</span>, <span className="font-mono font-semibold">stockAvailable</span>
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV File
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:transition-colors disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Maximum file size: 10MB
          </p>
        </div>

        {file && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-emerald-800 font-medium">{message}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload CSV
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CSVUpload;

