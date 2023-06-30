import React, {useEffect, useRef} from 'react';
import {Chart, registerables} from 'chart.js';

const BarChart = ({labels, data}) => {
    console.log(labels, data);
    const chartRef = useRef(null);
    const findHighestAndLowest = (numbers) => {
        if (numbers.length === 0) {
            return {highest: null, lowest: null};
        }

        let highest = numbers[0];
        let lowest = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] > highest) {
                highest = numbers[i];
            }

            if (numbers[i] < lowest) {
                lowest = numbers[i];
            }
        }

        return {highest, lowest};
    };
    const {highest, lowest} = findHighestAndLowest(data);
    console.log(highest, lowest);
    const numberOfDataPoints = data.length;
    const barThickness = 800 / numberOfDataPoints;

    useEffect(() => {
        let chartInstance = null;
        const createChart = (labels, data) => {
            const range = highest - lowest;
            const stepSize = range > 0 ? Math.ceil(range / 3) : 1;
            const ctx = chartRef.current.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '',
                            data: data,
                            backgroundColor: '#D5D5D5',
                            hoverBackgroundColor: '#F0C528',
                            borderWidth: 1,
                            barThickness: barThickness
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            ticks: {
                                callback: (value) => `${value}h`, // Display the value followed by "h"
                            },
                            beginAtZero: true,
                            stepSize: stepSize,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false, // Hide the legend box
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
