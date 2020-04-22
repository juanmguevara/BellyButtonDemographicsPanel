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
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
    PANEL.append("h6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("AGE: " + result.age);
    PANEL.append("h6").text("lOCATION: " + result.location);
    PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray2 = samples.filter(sampleObj => sampleObj.id == sample);
    var result2 = resultArray2[0];

    var otu_ids=result2.otu_ids;
    var otu_labels=result2.otu_labels;
    var sample_values=result2.sample_values;

    // Reverse the array due to Plotly's defaults
    console.log(sample_values);
    
    // Trace1 for the OTU Data
    var trace1 = {
      x: sample_values.slice(0, 10).reverse(), 
      y: otu_ids.slice(0, 10).map(otu_id=>`OTU ${otu_id}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      name: "OTU",
      type: "bar",
      orientation: "h"
    };

    // data
    var barData = [trace1];

    //Bar Horizontal Bar Chart
    // Apply the group bar mode to the layout
    var bar_layout = {
      title: "OTU Top 10",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    
    //Bubble Chart
    var trace2={
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: sample_values.map(d=>d/1.5),
        color: otu_ids,
        colorScale: "Earth"
      }
    };

    var bubbleData=[trace2];

    var bubble_layout={
      title: 'Bacteria Culture Per Sample',
      xaxis: {
        title: 'OTU ID'
      }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", barData, bar_layout);

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", bubbleData, bubble_layout);
  });
}
