import React from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart;
    const dataset = chart.data.datasets[0];
    if (!dataset) return;

    const mainValue = dataset.data[0];
    const valueText = mainValue.toFixed(2);
    const color = dataset.backgroundColor[0];

    ctx.save();
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(valueText, width / 2, height / 2);
    ctx.restore();
  },
};

const barValueTopPlugin = {
  id: "barValueTop",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        const xPos = bar.x;
        const yPos = bar.y - 4;
        ctx.fillText(value, xPos, yPos);
      });
    });
  }
};

const barValueCenterPlugin = {
  id: "barValueCenterPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];
        const label = `${value} KW`;
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const yPos = bar.y + (bar.base - bar.y) / 2;
        ctx.fillText(label, bar.x, yPos);
        ctx.restore();
      });
    });
  },
};

function getColor(value, min, max) {
  const ratio = (value - min) / (max - min);
  const r = Math.round(0 + ratio * 243);   
  const g = Math.round(200 - ratio * 200);
  const b = 0;
  return `rgb(${r},${g},${b})`;
}

export function DoughnutChart({ title, value }) {
  const MIN = 1;
  const MAX = 2.5;
  const clampedValue = Math.min(Math.max(value, MIN), MAX);

  const data = {
    labels: [title, ""],
    datasets: [
      {
        data: [clampedValue, MAX - clampedValue],
        backgroundColor: [getColor(clampedValue, MIN, MAX), "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="card shadow-sm h-100 w-100" style={{ borderRadius: 12 ,padding: "25px" }}>
      <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ height: "100%", padding: 10 }}>
        <h4 className="mb-2 text-center">{title}</h4>
        <div style={{ width: "90%", aspectRatio: "1 / 1" }}>
          <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
        </div>
      </div>
    </div>
  );
}

export function LineChart({ labels, values, label }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: values,
        fill: true,
        borderColor: "rgba(100, 181, 246, 1)",
        backgroundColor: "rgba(100, 181, 246, 0.2)",
        tension: 0.3,
        pointBackgroundColor: "rgba(100, 181, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  };

  const shadowPlugin = {
    id: "shadowPlugin",
    beforeDatasetsDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      ctx.shadowColor = "rgba(100, 181, 246, 0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
    },
    afterDatasetsDraw(chart) {
      chart.ctx.restore();
    },
  };

  return (
    <div className="card shadow-sm h-100 w-100" style={{ borderRadius: 12,padding: "15px"}}>
      <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ height: "100%", padding: 10 }}>
        <h4 className="card-title mb-3 text-center w-100">{label}</h4>
        <div style={{ width: "100%", maxWidth: "100%", aspectRatio: "1 / 1" }}>
          <Line data={data} options={options} plugins={[shadowPlugin]} />
        </div>
      </div>
    </div>
  );
}

export function LineChartMulti({ title, labels, datasets }) {
  const data = {
    labels: labels,
    datasets: datasets.map(ds => ({
      label: ds.label,
      data: ds.values,
      fill: false,
      borderColor: ds.color,
      tension: 0.3,
      pointBackgroundColor: ds.color,
      pointBorderColor: "#fff",
      pointHoverRadius: 5,
      pointRadius: 3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  };

  const shadowPlugin = {
    id: "shadowPlugin",
    beforeDatasetsDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
    },
    afterDatasetsDraw(chart) {
      chart.ctx.restore();
    },
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h4 className="card-title mb-3 text-center w-100">{title}</h4>
        <div style={{ width: "100%", height: "80%", padding: "10px" }}>
          <Line data={data} options={options} plugins={[shadowPlugin]} />
        </div>
      </div>
    </div>
  );
}

export function BarChartCard({ title, labels = [], values = [], barColor = "#f35525" }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: barColor,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} KW`;
          }
        }
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="card shadow-sm" style={{ borderRadius: 12, overflow: "hidden", padding: 10 }}>
      <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ height: "100%" }}>
        <h4 className="mb-2 text-center">{title}</h4>
        <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
          <Bar data={data} options={options} plugins={[barValueCenterPlugin]} />
        </div>
      </div>
    </div>
  );
}

export function BarChartCardCol({ title, labels = [], values = [], barColor = "#f32525ff" }) {
  const backgroundColors = Array.isArray(barColor) ? barColor : values.map(() => barColor);

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  };

  const barValueCenterPlugin = {
    id: "barValueCenterPlugin",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const value = dataset.data[index];
          ctx.save();
          ctx.fillStyle = "#e2e2e2ff";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const yPos = bar.y + (bar.base - bar.y) / 2;
          ctx.fillText(value, bar.x, yPos);
          ctx.restore();
        });
      });
    },
  };

  return (
    <div className="card shadow-sm" style={{ borderRadius: 12, overflow: "hidden", padding: 10 }}>
      <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ height: "100%" }}>
        <h4 className="mb-2 text-center">{title}</h4>
        <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
          <Bar data={data} options={options} plugins={[barValueTopPlugin]} />
        </div>
      </div>
    </div>
  );
}
