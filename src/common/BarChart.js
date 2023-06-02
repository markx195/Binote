import React, {useEffect, useRef} from 'react';
import {Chart, registerables} from 'chart.js';

const BarChart = ({labels, data}) => {
    console.log(labels,data)
    const chartRef = useRef(null);

    useEffect(() => {
        console.log(chartRef.current);
        let chartInstance = null;

        const createChart = (labels, data) => {
            const ctx = chartRef.current.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            ticks: {
                                callback: (value) => {
                                    // Format y-axis labels as "1h," "4h," "6h," "8h"
                                    if (value === 1) {
                                        return '1h';
                                    } else if (value === 4) {
                                        return '4h';
                                    } else if (value === 6) {
                                        return '6h';
                                    } else if (value === 8) {
                                        return '8h';
                                    } else {
                                        return "";
                                    }
                                },
                            },
                            beginAtZero: true,
                            stepSize: 2,
                        },
                    },
                },
            });
        };

        // Register the necessary components and scales
        Chart.register(...registerables);

        if (chartRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }

            createChart(labels, data);
        }

        // Clean up chart instance on component unmount
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [labels, data]);

    return <canvas ref={chartRef}/>;
};

export default BarChart;
