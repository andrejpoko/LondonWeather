import { ChartConfiguration } from 'chart.js';

export const lineChartOptions: ChartConfiguration['options'] = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'MMM dd',
        displayFormats: {
          day: 'ddd, D MMM',
        },
      },
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Temperature (°C)',
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
};
