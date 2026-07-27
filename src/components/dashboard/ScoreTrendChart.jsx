import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function ScoreTrendChart({ trend }) {
  const data = {
    labels: trend.map((t) => t.period),
    datasets: [
      {
        label: 'Average Score',
        data: trend.map((t) => t.averageScore),
        borderColor: '#9C6F2E',
        backgroundColor: 'rgba(184, 134, 59, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#9C6F2E',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Avg Score: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { stepSize: 20 } },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}
