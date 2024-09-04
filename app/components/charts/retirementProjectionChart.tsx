"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, Tooltip, LinearScale, PointElement, CategoryScale } from 'chart.js';

Chart.register(LineElement, Tooltip, LinearScale, PointElement, CategoryScale);

const RetirementProjectionChart = ( {retirementData}: any) => {
  console.log(retirementData);
  
  const yearsToRetirement = retirementData.retirementAge - retirementData.currentAge;
  const dataPoints = [];

  for (let i = 0; i <= yearsToRetirement; i++) {
    const yearlySavings = retirementData.currentSavings + (retirementData.monthlyContribution * 12 * i);
    dataPoints.push(yearlySavings);
  }

  const data = {
    labels: Array.from({ length: yearsToRetirement + 1 }, (_, i) => retirementData.currentAge + i),
    datasets: [
      {
        label: 'Projected Savings',
        data: dataPoints,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        fill: true,
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
      <Line data={data} options={options} />
    </div>
  );
};

export default RetirementProjectionChart;
