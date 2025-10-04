import React, { useState } from "react";
import axios from "axios";

function AnalyticsTab() {
  const [sensorId, setSensorId] = useState("");
  const [slope_zone, setSlopeZone] = useState("");
  const [rock_type, setRockType] = useState("");
  const [displacement_rate_mm_per_day, setDisplacementRate] = useState("");
  const [microseismic_events_daily, setMicroseismicEvents] = useState("");
  const [temperature_f, setTemperature] = useState("");
  const [precipitation_in, setPrecipitation] = useState("");

  const [rfPrediction, setRfPrediction] = useState(null);
  const [dlPrediction, setDlPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setRfPrediction(null);
    setDlPrediction(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/predict-risk/", {
        sensor_id: sensorId,
        slope_zone,
        rock_type,
        displacement_rate_mm_per_day: parseFloat(displacement_rate_mm_per_day),
        microseismic_events_daily: parseInt(microseismic_events_daily),
        temperature_f: parseFloat(temperature_f),
        precipitation_in: parseFloat(precipitation_in),
      });

      setRfPrediction(response.data.rf_prediction);
      setDlPrediction(response.data.dl_prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.response?.data?.error || "Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 75) return { level: "Critical", color: "text-red-500", bg: "bg-red-500/20" };
    if (score >= 50) return { level: "Warning", color: "text-orange-500", bg: "bg-orange-500/20" };
    return { level: "Safe", color: "text-green-500", bg: "bg-green-500/20" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Risk Prediction</h1>
          <p className="text-slate-400">
            Enter sensor parameters to predict rockfall risk using ML models
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Sensor Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Sensor ID
              </label>
              <input
                type="text"
                value={sensorId}
                onChange={(e) => setSensorId(e.target.value)}
                placeholder="e.g., SENSOR-001"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Slope Zone
              </label>
              <input
                type="text"
                value={slope_zone}
                onChange={(e) => setSlopeZone(e.target.value)}
                placeholder="e.g., Zone A"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Rock Type
              </label>
              <select
                value={rock_type}
                onChange={(e) => setRockType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="GRANITE">Granite</option>
                <option value="LIMESTONE">Limestone</option>
                <option value="SANDSTONE">Sandstone</option>
                <option value="SHALE">Shale</option>
                <option value="BASALT">Basalt</option>
                <option value="SCHIST">Schist</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Displacement Rate (mm/day)
              </label>
              <input
                type="number"
                step="0.1"
                value={displacement_rate_mm_per_day}
                onChange={(e) => setDisplacementRate(e.target.value)}
                placeholder="e.g., 5.2"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Microseismic Events (daily)
              </label>
              <input
                type="number"
                value={microseismic_events_daily}
                onChange={(e) => setMicroseismicEvents(e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature_f}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g., 72"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Precipitation (inches)
              </label>
              <input
                type="number"
                step="0.01"
                value={precipitation_in}
                onChange={(e) => setPrecipitation(e.target.value)}
                placeholder="e.g., 0.5"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {loading ? "Predicting..." : "Predict Risk"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {(rfPrediction !== null || dlPrediction !== null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Random Forest Result */}
            {rfPrediction !== null && (
              <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🌲 Random Forest Model
                </h3>
                <div className={`${getRiskLevel(rfPrediction).bg} rounded-lg p-6 text-center`}>
                  <p className="text-slate-300 text-sm mb-2">Risk Score</p>
                  <p className={`text-5xl font-bold ${getRiskLevel(rfPrediction).color}`}>
                    {rfPrediction.toFixed(1)}
                  </p>
                  <p className={`text-lg font-semibold mt-2 ${getRiskLevel(rfPrediction).color}`}>
                    {getRiskLevel(rfPrediction).level}
                  </p>
                </div>
              </div>
            )}

            {/* Deep Learning Result */}
            {dlPrediction !== null && (
              <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🧠 Deep Learning Model
                </h3>
                <div className={`${getRiskLevel(dlPrediction).bg} rounded-lg p-6 text-center`}>
                  <p className="text-slate-300 text-sm mb-2">Risk Score</p>
                  <p className={`text-5xl font-bold ${getRiskLevel(dlPrediction).color}`}>
                    {dlPrediction.toFixed(1)}
                  </p>
                  <p className={`text-lg font-semibold mt-2 ${getRiskLevel(dlPrediction).color}`}>
                    {getRiskLevel(dlPrediction).level}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsTab;
