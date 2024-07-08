import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DomainDistributionChart = ({ domainDistribution }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!domainDistribution || Object.keys(domainDistribution).length === 0) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const data = {
      labels: Object.keys(domainDistribution),
      datasets: [
        {
          label: 'Domain Distribution',
          data: Object.values(domainDistribution),
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [domainDistribution]);

  return <canvas ref={chartRef} />;
};

export default DomainDistributionChart;
