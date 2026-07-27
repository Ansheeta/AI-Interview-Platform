import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function TopicWiseChart({ breakdown }) {
  const sorted = [...breakdown].sort((a, b) => b.averageScore - a.averageScore);

  const data = {
    labels: sorted.map((b) => b.category),
    datasets: [
      {
        label: 'Average Score',
        data: sorted.map((b) => b.averageScore),
        backgroundColor: '#3F6B5E',
        borderRadius: 3,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Avg Score: ${ctx.parsed.x}`,
        },
      },
    },
    scales: {
      x: { min: 0, max: 100, ticks: { stepSize: 20 } },
    },
  };

  return (
    <div style={{ height: `${Math.max(sorted.length * 45, 180)}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
}
