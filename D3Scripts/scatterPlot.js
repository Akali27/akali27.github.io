function drawScaterChart(Container, data, XaxisLabel, YaxisLabel,Title) {
  /* -------- Set margin and height width -------- */
  var margin = {
      top: 40,
      right: 20,
      bottom: 60,
      left: 50
    },
    width = parseInt(d3.select(Container).style('width'), 10) - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

  /* 
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  /* --------  Setup x -------- */
  var xValue = function (d) {
      return d.x;
    }, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function (d) {
      return xScale(xValue(d));
    },
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickPadding(10);

  /* --------  Setup y -------- */
  var yValue = function (d) {
      return d.y;
    }, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function (d) {
      return yScale(yValue(d));
    }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0).tickPadding(10);

  /* --------  setup fill color -------- */
  var cValue = function (d) {
      return d.City;
    },

  color = d3.scale.ordinal()
    .range(["#98dafc"]);
    //,"#daad86","#5e0231","#e05038","#334431","#431c5d","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"

  /* --------  Add the graph canvas to the body of the webpage -------- */
  var svg = d3.select(Container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /* --------  Add the tooltip area to the webpage -------- */
  var tooltip = d3.select(Container).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    /* --------  Change string (from CSV) into number format -------- */
    data.forEach(function (d) {
      d.x = +d.x;
      d.y = +d.y;
    });

    var average = d3.mean(data.map(function (d) {
      return d.y
    }));
    /* --------  don't want dots overlapping axis, so add in buffer to data domain -------- */
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    /* --------  title -------- */
      svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(Title);

    /* --------  X-axis -------- */
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", +46)
      .style("text-anchor", "end")
      .text(XaxisLabel);

    /* --------  Y-axis -------- */
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -(width/3))
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(YaxisLabel);

    /* --------  Draw dots -------- */
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", function(d,i){ return "dot "})
      //.attr("class", "dot")
      .attr("r",  function (d) { return 5.5;})
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function (d) {
        return color(cValue(d));
      })
      .on("mouseover", function (d) {
        d3.selectAll(".dot").style("opacity", function (d) {
          return 0.5;
        });
        d3.select(this).style("opacity", 1);
        /* --------  Show Tooltip -------- */
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(
            " City Name : " + d["City"] + "<br/>" +
            YaxisLabel + " : " + yValue(d) + "<br/>" +
            XaxisLabel + " : " + xValue(d))
          .style("left", xScale(d.x) + "px")
          .style("top", yScale(d.y)-20 + "px");

      })
      .on("mouseout", function (d) {
        /* --------  Hide Tooltip -------- */
        d3.selectAll(".dot").style("opacity", function (d) {
          return 1;
        });
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
}