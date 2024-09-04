"use client"

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip } from 'chart.js';

Chart.register(BarElement, Tooltip);

const TaxEstimationChart = ({ taxData }: any) => {
  
  const taxableIncome = taxData.annualIncome - taxData.deductions;
  const taxBrackets = {
    single: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
    married: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
  };

  const taxRates = taxBrackets[taxData.filingStatus] || taxBrackets.single;
  const taxEstimate = taxableIncome * taxRates[taxRates.length - 1]; // Simplified

  const data = {
    labels: ['Tax Estimate'],
    datasets: [
      {
        label: 'Estimated Tax',
        data: [taxEstimate],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TaxEstimationChart;
