// Function to initialize the dashboard
function init() {
    // Select the dropdown element
    var selector = d3.select("#selDataset");

    // Fetch the JSON data
    d3.json("samples.json").then((data) => {
        // Populate the dropdown with sample names
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to initialize the dashboard
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Function to build metadata panel
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var result = metadata.find(sampleObj => sampleObj.id.toString() === sample);
        var PANEL = d3.select("#sample-metadata");

        // Clear any existing metadata
        PANEL.html("");

        // Add each key-value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to build charts
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var result = samples.find(sampleObj => sampleObj.id === sample);

        // Bar chart
        var barData = [{
            x: result.sample_values.slice(0, 10).reverse(),
            y: result.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: result.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        var barLayout = {
            title: "Top 10 OTUs Found",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", barData, barLayout);
    });
}

// Function to update the dashboard
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
