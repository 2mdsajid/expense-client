import React from "react";
import * as d3 from "d3";

const PieCharts = ({ data }) => {
    // Create an object to store the total expenses for each category
    const totalExpensesByCategory = {};

    // Loop through the data to calculate the total expenses for each category
    data.forEach((expense) => {
        if (totalExpensesByCategory[expense.category]) {
            totalExpensesByCategory[expense.category] += expense.price;
        } else {
            totalExpensesByCategory[expense.category] = expense.price;
        }
    });

    // Convert the object into an array of objects
    const dataForPieChart = Object.keys(totalExpensesByCategory).map((key) => {
        return { category: key, price: totalExpensesByCategory[key] };
    });

    // Create a color scale for the pie chart
    const colorScale = d3.scaleOrdinal()
        .domain(dataForPieChart.map((d) => d.category))
        .range(d3.schemeCategory10);

    // Create the pie chart
    const pie = d3.pie().value((d) => d.price);
    const pieData = pie(dataForPieChart);

    // Create the arc generator for the pie chart
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(120);

    // Calculate the total expenses
    const totalExpenses = dataForPieChart.reduce((total, d) => total + d.price, 0);

    // Render the pie chart with labels and percentages
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width={300} height={300}>
                <g transform={`translate(${150},${150})`}>
                    {pieData.map((d) => (
                        <g key={d.index}>
                            <path d={arc(d)} fill={colorScale(d.data.category)} />
                            <text
                                transform={`translate(${arc.centroid(d)})`}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="10px"
                            >
                                <tspan x="0" dy="-0.5em">{d.data.category}</tspan>
                                <tspan x="0" dy="1.2em">
                                    {`${Math.floor((d.data.price / totalExpenses) * 100)}%`}
                                </tspan>
                            </text>

                        </g>
                    ))}
                </g>
                {/* <g transform={`translate(${250},${50})`}>
          {dataForPieChart.map((d, i) => (
            <g key={i} transform={`translate(${0},${i * 20})`}>
              <rect
                x={0}
                y={0}
                width={10}
                height={10}
                fill={colorScale(d.category)}
              />
              <text x={15} y={10} fontSize="10px">
                {`${d.category} (${((d.price / totalExpenses) * 100).toFixed(1)}%)`}
              </text>
            </g>
          ))}
        </g> */}
            </svg>
        </div>
    );
};

export default PieCharts;
