import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  data: number[]
  labels: string[]
}

export function BarChart({ data, labels }: BarChartProps) {
    const chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: "rgb(249, 115, 22)",
          borderRadius: 4,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false, // Disable aspect ratio to control height independently
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: "#f3f4f6",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };
  
    // Explicitly set the height of the chart
    return (
        <div style={{ height: "400px", width: "100%" }}>
          <Bar data={chartData} options={options} />
        </div>
      );  }
  

