import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { t, translateCategory } from '../../utils/translations';
import Chart from 'chart.js/auto';

export default function ChartsPanel() {
  const { data, currentLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  return (
    <div className="charts-panel">
      <div className="charts-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>📈 {t('chartsGraphs', currentLanguage)}</h2>
        <span className="charts-toggle-icon">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="charts-content">
          <ChartsContent />
        </div>
      )}
    </div>
  );
}

function ChartsContent() {
  const { data, currentLanguage } = useApp();

  if (!data) return null;

  return (
    <div className="charts">
      <ExpenseChart />
      <TrendChart />
      <MerchantChart />
      <SavingsRateChart />
      <CumulativeCashFlowChart />
    </div>
  );
}

function ExpenseChart() {
  const { data, currentLanguage } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = Object.keys(data.expenses_by_category).map(cat => translateCategory(cat, currentLanguage));
    const values = Object.values(data.expenses_by_category);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: €${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, currentLanguage]);

  return (
    <div className="chart-container">
      <h3>{t('expensesByCategory', currentLanguage)}</h3>
      <canvas ref={canvasRef} id="expenseChart"></canvas>
    </div>
  );
}

function TrendChart() {
  const { data, currentLanguage } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const months = [...new Set([
      ...Object.keys(data.monthly_trends.expenses),
      ...Object.keys(data.monthly_trends.income)
    ])].sort();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: t('expenses', currentLanguage),
          data: months.map(m => data.monthly_trends.expenses[m] || 0),
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: t('income', currentLanguage),
          data: months.map(m => data.monthly_trends.income[m] || 0),
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: €${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '€' + Number(value).toFixed(0)
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, currentLanguage]);

  return (
    <div className="chart-container">
      <h3>{t('monthlyTrends', currentLanguage)}</h3>
      <canvas ref={canvasRef} id="trendChart"></canvas>
    </div>
  );
}

function MerchantChart() {
  const { data, currentLanguage } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = Object.keys(data.top_expense_merchants).slice(0, 10);
    const values = Object.values(data.top_expense_merchants).slice(0, 10);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: t('amountSpent', currentLanguage),
          data: values,
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => '€' + context.parsed.y.toFixed(2)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '€' + Number(value).toFixed(0)
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, currentLanguage]);

  return (
    <div className="chart-container">
      <h3>{t('topExpenseMerchants', currentLanguage)}</h3>
      <canvas ref={canvasRef} id="merchantChart"></canvas>
    </div>
  );
}

function SavingsRateChart() {
  const { data, currentLanguage } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const months = Object.keys(data.monthly_stats).sort();
    const savingsRates: (number | null)[] = [];
    const netBalances: number[] = [];

    months.forEach(month => {
      const stats = data.monthly_stats[month];
      const netBalance = stats.income - stats.expenses;
      netBalances.push(netBalance);
      
      if (stats.income === 0) {
        savingsRates.push(null);
      } else {
        savingsRates.push(((stats.income - stats.expenses) / stats.income) * 100);
      }
    });

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: t('savingsRate', currentLanguage),
          data: savingsRates,
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const value = context.parsed.y;
                const netBalance = netBalances[index];
                
                if (value === null) return t('noIncomeData', currentLanguage);
                
                const sign = netBalance >= 0 ? '+' : '';
                return [
                  `${t('savingsRate', currentLanguage)}: ${value.toFixed(1)}%`,
                  `${t('amountSaved', currentLanguage)}: ${sign}€${netBalance.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => Number(value).toFixed(0) + '%'
            },
            title: {
              display: true,
              text: t('savingsRate', currentLanguage)
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, currentLanguage]);

  return (
    <div className="chart-container">
      <h3>{t('savingsRateOverTime', currentLanguage)}</h3>
      <canvas ref={canvasRef} id="savingsRateChart"></canvas>
    </div>
  );
}

function CumulativeCashFlowChart() {
  const { data, currentLanguage } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const months = Object.keys(data.monthly_stats).sort();
    let cumulativeTotal = 0;
    const cumulativeFlow: number[] = [];
    const monthlyDifferences: number[] = [];

    months.forEach((month, index) => {
      const stats = data.monthly_stats[month];
      const monthlyNetBalance = stats.income - stats.expenses;
      cumulativeTotal += monthlyNetBalance;
      cumulativeFlow.push(cumulativeTotal);
      
      if (index === 0) {
        monthlyDifferences.push(monthlyNetBalance);
      } else {
        monthlyDifferences.push(cumulativeFlow[index] - cumulativeFlow[index - 1]);
      }
    });

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: t('cumulativeCashFlowLabel', currentLanguage),
          data: cumulativeFlow,
          borderColor: '#9966FF',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const cumulativeValue = context.parsed.y;
                const monthlyDiff = monthlyDifferences[index];
                
                const cumulativeSign = cumulativeValue >= 0 ? '+' : '';
                const diffSign = monthlyDiff >= 0 ? '+' : '';
                
                return [
                  `${t('cumulative', currentLanguage)}: ${cumulativeSign}€${cumulativeValue.toFixed(2)}`,
                  `${t('monthlyChange', currentLanguage)}: ${diffSign}€${monthlyDiff.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => '€' + Number(value).toFixed(0)
            },
            title: {
              display: true,
              text: `${t('cumulativeCashFlowLabel', currentLanguage)} (€)`
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, currentLanguage]);

  return (
    <div className="chart-container">
      <h3>{t('cumulativeCashFlow', currentLanguage)}</h3>
      <canvas ref={canvasRef} id="cumulativeCashFlowChart"></canvas>
    </div>
  );
}

