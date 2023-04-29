import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarCharts = ({ expensesData }) => {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Define chart dimensions
    const margin = { top: 20, right: 20, bottom: 70, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Parse date strings into date objects
    const formatDate = d3.timeFormat("%b %Y");
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    const data = expensesData.map((d) => ({
      ...d,
      date: parseDate(d.date),
    }));

    // Compute the total expenses for each month
    const monthlyExpenses = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.price),
      (d) => d3.timeMonth(d.date)
    );

    // Set up scales and axes
    const xScale = d3
      .scaleBand()
      .domain(monthlyExpenses.keys())
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(monthlyExpenses.values())])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).tickFormat(formatDate);
    const yAxis = d3.axisLeft(yScale);

    // Draw bars
    svg
      .selectAll(".bar")
      .data(monthlyExpenses)
      .join("rect")
      .attr("class", "bar")
      .attr("x", ([date]) => xScale(date))
      .attr("y", ([, value]) => yScale(value))
      .attr("width", xScale.bandwidth())
      .attr("height", ([, value]) => height - margin.bottom - yScale(value));

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .attr("text-anchor", "middle")
      .text("Month");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", margin.left / 2 - 10)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Total expenses ");
  }, [expensesData]);

  return (
    <svg
      ref={chartRef}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default BarCharts
