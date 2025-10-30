// Step 4 — Load the data (columns include: brand, model, star2, energyConsumption, screenTech)
d3.csv("./data/Ex6_TVdata.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,
    star: +d.star
})).then(data => {
    console.log(data);

    // Call functions after data to the console
    drawHistogram(data);
    populateFilters(data);

    drawScatterplot(data);
    createTooltipS();
    handleMouseEvents();

}).catch(error => {
    console.error("Error loading the csv file: ", error);
});