function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}
init();

// function optionChanged(newSample) {
//   console.log(newSample);
// }

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text(result.location);
  });
}

//Bar Horizontal Bar Chart

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    // var sample_values = data.sample_values;
    // var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // var result = resultArray[0];

    // Sort the data array using the sample value
    data.sort(function(a,b){
      return parseFloat(b.otu_ids) - parseFloat(a.otu_ids);
    });

    // Slice the first 10 objects for plotting
    data = data.slice(0,10);

    // Reverse the array due to Plotly's defaults
    data = data.reverse();
    
    // Trace1 for the OTU Data
    var trace1 = {
      x: data.map(row => row.otu_ids),
      y: data.map(row => row.otu_labels),
      text: data.map(row => row.otu_labels),
      name: "OTU",
      type: "bar",
      orientation: "h"
    };

    // data
    var data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
      title: "OTU Top 10",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);
  });
}
