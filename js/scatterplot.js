function drawScatterplot(data) {
  // Step 2.1 / 2.2 — SVG + inner chart for scatterplot
  // Set the dimensions and margines of the chart area
  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG
  
  // Create an inner chart group with margins 
  innerChartS = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Step 2.3 — Set up x and y scales (use extents of fields)
  // (Change accessors here if your handout specifies different fields)

  const xExtent = d3.extent(data, d => d.star);
  const yExtent = d3.extent(data, d => d.screenSize);

  const xScaleS = d3.scaleLinear()
    .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
    .range([0, innerWidth]);

  const yScaleS = d3.scaleLinear()
    .domain([yExtent[0], yExtent[1]])
    .range([innerHeight, 0])
    .nice();

  const uniqueTechs = Array.from(new Set(data.map(d => d.screenTech)));
  // Step 2.4 - Set up colour scale
  colorScale
    .domain(data.map(d => d.screenTech)) // Get unique screenTech values
    .range(d3.schemeCategory10); // use a predefiend color scheme

  // Step 2.5 - Draw circles
  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.screenSize))
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5); // make overlap readable; no stroke

  // Step 2.6 - Axes
  const bottomAxis = d3.axisBottom(xScaleS);
  const leftAxis = d3.axisLeft(yScaleS);

  innerChartS.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  // Axis labels (like histogram style)
  svg.append("text")
    .text("Star Rating")
    .attr("text-anchor", "end")
    .attr("x", width - 20)
    .attr("y", height - 5)
    .attr("class", "axis-label");

  innerChartS.append("g")
    .call(leftAxis);

  svg.append("text")
    .text("Screen size (inches)")
    .attr("x", 30)
    .attr("y", 20)
    .attr("class", "axis-label");

  // Step 2.7 — Legend (simple categorical legend for screenTech)
  const legend = innerChartS.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 140}, ${margin.top})`);

  uniqueTechs.forEach((tech, i) => {
    const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
    g.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colorScale(tech));
    g.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .text(tech)
        .attr('class', 'axis-label');
  });
}
