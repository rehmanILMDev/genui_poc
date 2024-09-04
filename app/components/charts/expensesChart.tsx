"use client"

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip);

const ExpensesChart = ({spendingData} : any) => {
console.log(spendingData);

  const data = {
    labels: spendingData.expenses?.map((item: { category: any; }) => item.category),
    datasets: [
      {
        label: 'Spending',
        data: spendingData.expenses?.map((item: { amount: any; }) => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
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
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ExpensesChart;
