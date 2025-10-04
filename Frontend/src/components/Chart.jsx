import React, { useEffect, useRef } from 'react';

const Chart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !Array.isArray(data) || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const DENSITY_FACTOR = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * DENSITY_FACTOR;
    canvas.height = canvas.offsetHeight * DENSITY_FACTOR;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous transforms
    ctx.scale(DENSITY_FACTOR, DENSITY_FACTOR);

    const padding = 30;
    const chartWidth = canvas.offsetWidth - 2 * padding;
    const chartHeight = canvas.offsetHeight - 2 * padding;

    const xValues = data.map(d => d.time);
    const yValues = data.map(d => d.value);

    const maxX = Math.max(xValues.length - 1, 1);
    const maxY = Math.max(Math.max(...yValues) * 1.1, 1); // Ensure nonzero maxY

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw X-axis labels
    ctx.fillStyle = '#A3A3A3';
    ctx.font = '10px Inter, sans-serif';
    xValues.forEach((label, i) => {
      const x = padding + (i / maxX) * chartWidth;
      ctx.textAlign = 'center';
      ctx.fillText(label, x, canvas.offsetHeight - padding / 2);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const yLabel = (maxY / yTicks * i).toFixed(1);
      const y = padding + chartHeight - (i / yTicks) * chartHeight;
      ctx.fillText(yLabel, padding - 5, y);
    }

    // Draw grid lines
    ctx.strokeStyle = '#2F2F2F';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= yTicks; i++) {
      const y = padding + chartHeight - (i / yTicks) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    xValues.forEach((_, i) => {
      const x = padding + (i / maxX) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    });

    // Draw the line chart
    ctx.beginPath();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach((point, i) => {
      const x = padding + (i / maxX) * chartWidth;
      const y = padding + chartHeight - (point.value / maxY) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw points
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.stroke();
  }, [data]);

  return (
    <div className="w-full h-48 relative">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default Chart;
