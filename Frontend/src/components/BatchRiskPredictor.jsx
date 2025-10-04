import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function BatchRiskPredictor() {
  const [csvFile, setCsvFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setPredictions([]);
    setError("");
  };

  const handlePredict = async () => {
    if (!csvFile) {
      setError("Please select a CSV file first");
      return;
    }

    setLoading(true);
    setError("");
    setPredictions([]);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data;
          const predictionResults = [];

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            try {
              const response = await axios.post("http://127.0.0.1:8000/api/predict-risk/", {
                sensor_id: row.sensor_id || `SENSOR-${i}`,
                slope_zone: row.slope_zone || "Unknown",
                rock_type: row.rock_type || "GRANITE",
                displacement_rate_mm_per_day: parseFloat(row.displacement_rate_mm_per_day || 0),
                microseismic_events_daily: parseInt(row.microseismic_events_daily || 0),
                temperature_f: parseFloat(row.temperature_f || 65),
                precipitation_in: parseFloat(row.precipitation_in || 0),
              });

              predictionResults.push({
                sensor_id: row.sensor_id || `SENSOR-${i}`,
                rf_prediction: response.data.rf_prediction,
                dl_prediction: response.data.dl_prediction,
              });
            } catch (err) {
              console.error(`Error predicting row ${i}:`, err);
              predictionResults.push({
                sensor_id: row.sensor_id || `SENSOR-${i}`,
                rf_prediction: 0,
                dl_prediction: 0,
                error: true
              });
            }

            setPredictions([...predictionResults]);
          }

          setLoading(false);
        } catch (err) {
          setError("Failed to process CSV file");
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`CSV parsing error: ${err.message}`);
        setLoading(false);
      }
    });
  };

  const chartData = {
    labels: predictions.slice(0, 20).map((p) => p.sensor_id), // Limit to 20 for readability
    datasets: [
      {
        label: "RF Prediction",
        data: predictions.slice(0, 20).map((p) => p.rf_prediction),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "DL Prediction",
        data: predictions.slice(0, 20).map((p) => p.dl_prediction),
        backgroundColor: "rgba(168, 85, 247, 0.7)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'rgba(148, 163, 184, 1)'
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.5)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(148, 163, 184, 1)'
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.5)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(148, 163, 184, 1)'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Batch Risk Prediction</h1>
        <p className="text-slate-400 mb-8">Upload CSV file to predict risks for multiple sensors</p>

        {/* File Upload */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />
            <button
              onClick={handlePredict}
              disabled={loading || !csvFile}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? `Processing... (${predictions.length})` : "Predict All"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results Table */}
        {predictions.length > 0 && (
          <>
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6 overflow-x-auto max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-white mb-4">
                Prediction Results ({predictions.length} sensors)
              </h2>
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-900">
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-slate-300">Sensor ID</th>
                    <th className="py-3 px-4 text-slate-300">RF Score</th>
                    <th className="py-3 px-4 text-slate-300">DL Score</th>
                    <th className="py-3 px-4 text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => {
                    const avgScore = (pred.rf_prediction + pred.dl_prediction) / 2;
                    const status = avgScore >= 75 ? 'Critical' : avgScore >= 50 ? 'Warning' : 'Safe';
                    const statusColor = avgScore >= 75 ? 'text-red-400' : avgScore >= 50 ? 'text-orange-400' : 'text-green-400';
                    
                    return (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800">
                        <td className="py-3 px-4 text-white">{pred.sensor_id}</td>
                        <td className="py-3 px-4 text-blue-400 font-semibold">{pred.rf_prediction}</td>
                        <td className="py-3 px-4 text-purple-400 font-semibold">{pred.dl_prediction}</td>
                        <td className={`py-3 px-4 font-semibold ${statusColor}`}>{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Chart - FIXED HEIGHT */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Risk Score Comparison (First 20 sensors)
              </h2>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BatchRiskPredictor;
