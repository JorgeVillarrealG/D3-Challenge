// @TODO: YOUR CODE HERE!
let svgWidht=1500
let svgHeight= 500
let margin ={
    top:20,
    right:60,
    bottom:20,
    left:60
}
let chartwidth=svgWidht-margin.left-margin.right
let chartheight=svgHeight-margin.top-margin.bottom

//SVG Wrapper
let svg=d3.select("#scatter")
.append("svg")
.attr("widht",svgWidht)
.attr("height",svgHeight)
let chartGroup=svg.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`)

//Import Data
d3.csv("assets/data/data.csv").then(function(data){
    //Parse Data
    data.forEach(function(data){
        data.poverty=+data.poverty
        data.healthcare=+data.healthcare
    })
    console.log(data)
    //Scale Functions
    let xLinearScale=d3.scaleLinear()
    //.domain([0,d3.max(data,d=>d.poverty)])
    .domain(d3.extent(data,d=>d.poverty))
    .range([0,chartwidth])
    let yLinearScale=d3.scaleLinear()
    .domain([0,d3.max(data,d=>d.healthcare)])
    .range([chartheight,0])
    //Axis Functions
    let bottomAxis=d3.axisBottom(xLinearScale)
    let leftAxis=d3.axisLeft(yLinearScale)
    //Append Axes to Chart
    chartGroup.append("g")
        .attr("transform",`translate(0,${chartheight})`)
        .call(bottomAxis)
    chartGroup.append("g")
        .call(leftAxis)
    //Create Circles
    let circleGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx",d=>xLinearScale(d.poverty))
    .attr("cy",d=>yLinearScale(d.healthcare))
    .attr("r","15")
    .attr("fill","blue")
    .attr("opacity",".6")
    .append("text")
    .text(function(data){
        return data.abbr
    })
    .attr("x",d=>xLinearScale(d.poverty))
    .attr("y",d=>yLinearScale(d.healthcare))
    .attr("class","axisText")
    //tooltip
   /*  let toolTip=d3.tip()
    .attr("class","tooltip")
    .offset([80,-60])
    .html("") */
    //Axle Lables
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.left)
    .attr("x", 0-(chartheight/2))
    .attr("dy","1em")
    .attr("class","axisText")
    .text("Helthcare %")
    chartGroup.append("text")
    .attr("transform",`translate(${chartwidth/2},${chartheight+margin.top+10})`)
    .attr("class","axisText")
    .text("Poverty %")

})
.catch(e=>{
    console.log(e)
})