// Step 6 — Build our histogram (follows the handout’s structure)
function drawHistogram(data) {
  // Step 6.2 — Set up bins (bin generator is defined in shared-constants)
  const bins = binGenerator(data);
  // console.log(bins); // (Optional) Inspect bins as per handout

  // Step 6.3 — Define the scales
  // x-asix: Lower bound of first bin / upper bound of last bin
  const minTime = bins[0]?.x0 ?? 0;
  const maxTime = bins[bins.length - 1]?.x1 ?? 1;
  // y-axis: Max bin length drives y domain
  const binsMaxLength = d3.max(bins, d => d.length) ?? 0;

  xScale
    .domain([minTime, maxTime])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice();

  // Step 6.1 — Set up the chart area (inner chart)
  const svg = d3.select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("id", "histogram-inner")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Step 6.4 — Draw the bars of the histogram
  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)) // small gap
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor)
      .attr("stroke", bodyBackgroundColor)   // creates the subtle visual gap
      .attr("stroke-width", 2);

  // Step 6.5 — Add bottom axis
  const bottomAxis = d3.axisBottom(xScale);
  innerChart
    .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  // x label
  svg.append("text")
    .text("Energy consumption (kWh)")
    .attr("x", margin.left + innerWidth)
    .attr("y", height - 5)
    .attr("text-anchor", "end");

  // Step 6.6 — Add left axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .attr("class", "axis axis--y")
      .call(leftAxis);

  // y label
  svg.append("text")
    .text("Frequency")
    .attr("x", 5)
    .attr("y", 20);
    
}
