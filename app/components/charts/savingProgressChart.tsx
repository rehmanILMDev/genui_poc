"use client"

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart, LinearScale} from 'chart.js'
import { log } from 'util';


Chart.register(LinearScale, CategoryScale, BarElement);

const SavingsProgressChart = ({savingsGoalData}: any) => {
 console.log(savingsGoalData);
 
  const chartData = {
    labels: ['Goal Amount', 'Current Savings', 'Monthly Contribution'],
    datasets: [
      {
        label: 'Savings Progress',
        data: [savingsGoalData.goalAmount, savingsGoalData.currentSavings, savingsGoalData.monthlyContribution],
        backgroundColor: ['#4BC0C0', '#FF6384', '#36A2EB'],
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(savingsGoalData.goalAmount, savingsGoalData.currentSavings + savingsGoalData.monthlyContribution) + 1000,
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default SavingsProgressChart;
