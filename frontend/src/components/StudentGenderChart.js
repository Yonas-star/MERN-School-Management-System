import React from 'react';
import { Bar } from 'react-chartjs-2';

const StudentGenderChart = ({ maleCount, femaleCount }) => {
    // Ensure maleCount and femaleCount are valid numbers
    const validMaleCount = typeof maleCount === 'number' ? maleCount : 0;
    const validFemaleCount = typeof femaleCount === 'number' ? femaleCount : 0;

    const data = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                label: 'Number of Students',
                data: [validMaleCount, validFemaleCount],
                backgroundColor: ['#4caf50', '#ff5722'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Number of Students by Gender',
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default StudentGenderChart;