import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import api from '../services/api';

const ClearDataModal = ({ onClose, onDataCleared }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleClearData = async () => {
    // Require user to type "DELETE" to confirm
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsClearing(true);
    setError('');

    try {
      const response = await api.delete('/sensors/clear_all/');
      
      // Show success message
      alert(`✅ Data cleared successfully!\n\n` +
            `Sensors deleted: ${response.data.sensors_deleted}\n` +
            `Alerts deleted: ${response.data.alerts_deleted}`);
      
      // Callback to refresh dashboard
      if (onDataCleared) {
        onDataCleared();
      }
      
      onClose();
    } catch (err) {
      console.error('Error clearing data:', err);
      if (err.response?.status === 403) {
        setError('❌ Only admins can clear data');
      } else {
        setError(err.response?.data?.error || '❌ Failed to clear data');
      }
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border-2 border-red-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <FaExclamationTriangle className="text-white text-2xl" />
            <h2 className="text-2xl font-bold text-white">Clear All Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
            <p className="text-red-400 font-semibold mb-2">⚠️ WARNING</p>
            <p className="text-slate-300 text-sm">
              This action will permanently delete:
            </p>
            <ul className="text-slate-300 text-sm mt-2 space-y-1 ml-4">
              <li>• All sensor readings</li>
              <li>• All alerts</li>
              <li>• All historical data</li>
            </ul>
            <p className="text-red-400 text-sm mt-3 font-semibold">
              This action CANNOT be undone!
            </p>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Type <span className="text-red-400 font-bold">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isClearing}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isClearing}
              className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClearData}
              disabled={isClearing || confirmText !== 'DELETE'}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <FaTrash />
              <span>{isClearing ? 'Clearing...' : 'Clear All Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearDataModal;
