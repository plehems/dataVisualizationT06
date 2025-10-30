// ----- Layout (Inner chart pattern: Dufour & Meeks style)
const margin = { top: 40, right: 20, bottom: 50, left: 50 };
const width  = 1000; // Total width of the chart
const height = 500; // Total height of the chart
const innerWidth  = width  - margin.left - margin.right;
const innerHeight = height - margin.top  - margin.bottom;

// ----- A separate inner chaart group for the scatterplot (so it doesn't clash with histogram)
let innerCharts;

const tooltipWidth = 65;
const tooltipHeight = 32;

// ----- Colours (as per handout pattern; change to your scheme if needed)
// We use bodyBackgroundColor to create the subtle gap between bars.
const bodyBackgroundColor = "#FFF0D6";   // match your container bg (no borders)
const barColor            = "#FF9D00";   // from your palette

// ----- Scales (shared so updateHistogram can reuse them)
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();
const xScales = d3.scaleLinear();
const yScales = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

// ----- Bin generator (kept in shared constants so updates reuse it)
const binGenerator = d3.bin()
  .value(d => d.energyConsumption); // change to another numeric field if needed

// ----- Filters config (screen tech)
const filters_screen = [
  { id: "all",  label: "All",  isActive: true  },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];
