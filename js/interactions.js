// Step 7 — Building the filters (populate buttons + update logic)

// Step 7.1 — Set up filters function
function populateFilters(data) {
  // Step 7.3 — Set up buttons and event listeners
  const host = d3.select("#filters_screen");

  host.selectAll(".filter")
    .data(filters_screen)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)
      .on("click", (_, clicked) => {
        // (3) update status: single-active
        filters_screen.forEach(f => f.isActive = (f.id === clicked.id));
        // (4) toggle active class
        host.selectAll(".filter").classed("active", d => d.isActive);
        // (5) pass id + data to update
        updateHistogram(clicked.id, data);
      });
}

// Step 7.4 — Update the histogram
function updateHistogram(filterId, data) {
  // Create updatedData
  const updatedData = (filterId === "all")
    ? data
    : data.filter(d => d.screenTech === filterId);

  // Update bins from updatedData using the SAME binGenerator
  const updatedBins = binGenerator(updatedData);

  // Update y-scale domain
  const updatedMax = d3.max(updatedBins, d => d.length) ?? 0;
  yScale.domain([0, updatedMax]).nice();

  // Apply transitions to bars
  const innerChart = d3.select("#histogram-inner");

  const bars = innerChart.selectAll("rect")
    .data(updatedBins);

  bars.join(
    enter => enter.append("rect")
      .attr("x", d => xScale(d.x0))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr("y", yScale(0))
      .attr("height", 0)
      .attr("fill", barColor)
      .attr("stroke", bodyBackgroundColor)
      .attr("stroke-width", 2)
      .call(enter => enter.transition().duration(500)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length))
      ),
    update => update
      .call(update => update.transition().duration(500)
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length))
      ),
    exit => exit
      .call(exit => exit.transition().duration(350)
        .attr("y", yScale(0))
        .attr("height", 0)
        .remove()
      )
  );

  // Update the left axis to reflect new y-domain
  innerChart.select(".axis--y")
    .transition().duration(500)
    .call(d3.axisLeft(yScale));
}

// ==============================
// Scatterplot tooltip (Step 3)
// ==============================
// Keep a module-level ref so both functions can use it
// Shared variable so both functions can use it
let tooltipS;

function createTooltipS() {
  // Step 3.2 — append tooltip to innerChartS and hide it
  tooltipS = innerChartS.append("g")
    .attr("class", "tooltip-s")
    .style("opacity", 0);

  // Step 3.3 — background rect (reuse your chosen colour)
  tooltipS.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("fill", "#0a0a0aff")
    .attr("fill-opacity", 0.75);

  // Step 3.4 — centered text node
  tooltipS.append("text")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2 + 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", 900);

  return tooltipS;
}

const handleMouseEvents = () => {
  innerChartS.selectAll("circle")
    .on("mouseenter", (e, d) => {
      // 1) set tooltip text (show screen size)
      tooltipS.select("text").text(`${d.screenSize}"`);

      // 2) read circle position
      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // 3) position tooltip above the circle and fade in
      tooltipS
        .attr("transform",
          `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
        .transition().duration(200)
        .style("opacity", 1);
    })
    .on("mouseleave", () => {
      // 4) fade out and park off-canvas
      tooltipS
        .style("opacity", 0)
        .attr("transform", `translate(0, ${innerHeight + 500})`);
    });
};

