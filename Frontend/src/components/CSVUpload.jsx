import React, { useState } from 'react';
import { FaUpload, FaFileAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import api from '../services/api';

const CSVUpload = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    setError('');
    setUploadResult(null);

    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Upload CSV file
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/sensors/upload_csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult({
        success: true,
        message: response.data.message,
        created: response.data.created,
        errors: response.data.errors || 0,
        total: response.data.total_processed,
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    setUploadResult(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Upload Sensor Data</h2>
            <p className="text-slate-400 text-sm mt-1">
              Upload CSV file with sensor readings
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <FaUpload className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-white font-medium mb-2">
              Drag and drop your CSV file here
            </p>
            <p className="text-slate-400 text-sm mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors">
                Browse Files
              </span>
            </label>
            <p className="text-slate-500 text-xs mt-4">
              Maximum file size: 50MB
            </p>
          </div>

          {/* Selected File */}
          {file && (
            <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="text-blue-400" size={32} />
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FaCheckCircle className="text-green-400 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-green-400">
                    {uploadResult.message}
                  </p>
                  <div className="mt-2 text-sm text-slate-300">
                    <p>✅ Created: {uploadResult.created} records</p>
                    {uploadResult.errors > 0 && (
                      <p className="text-yellow-400">
                        ⚠️ Errors: {uploadResult.errors} records
                      </p>
                    )}
                    <p>📊 Total processed: {uploadResult.total} rows</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              !file || uploading
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </span>
            ) : (
              'Upload CSV'
            )}
          </button>

          {/* CSV Format Help */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm font-medium mb-2">
              CSV Format Requirements:
            </p>
            <ul className="text-slate-400 text-xs space-y-1">
              <li>• Must include all 45 required fields</li>
              <li>• timestamp, sensor_id, latitude, longitude are required</li>
              <li>• Rock type: GRANITE, LIMESTONE, SANDSTONE, SHALE, BASALT, SCHIST</li>
              <li>• Risk score: 0-100</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;
