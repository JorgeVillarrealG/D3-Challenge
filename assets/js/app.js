// @TODO: YOUR CODE HERE!
let svgWidht=960
let svgHeight= 500
let margin ={
    top:20,
    right:40,
    bottom:100,
    left:100
}
let chartwidth=svgWidht-margin.left-margin.right
let chartheight=svgHeight-margin.top-margin.bottom

//SVG Wrapper
let svg=d3.select("#scatter")
.append("svg")
.attr("width",svgWidht)
.attr("height",svgHeight)

let chartGroup=svg.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`)

//Initial Axis 
let chooseXAxis="poverty"
let chooseYAxis="healthcare"
//Update X-Axis
function XScale(input_data,chooseXAxis){
    let xLinearScale=d3.scaleLinear()
        .domain([d3.min(input_data,d=>d[chooseXAxis]),d3.max(input_data,d=>d[chooseXAxis])])
        .range([0,chartwidth])
    return xLinearScale
}
//Update Y-axis 
function YScale(input_data,chooseYAxis){
    let yLinearScale=d3.scaleLinear()
        .domain([0,d3.max(input_data,d=>d[chooseYAxis])])
        .range([chartheight,0])
    return yLinearScale
}
function renderXAxes(newXScale,xAxis){
    let bottomAxis=d3.axisBottom(newXScale)
    xAxis.trasition()
        .duration(1000)
        .call(bottomAxis) 
    return xAxis
}
function renderYAxes(newYScale,yAxis){
    let leftAxis=d3.axisLeft(newYScale)
    yAxis.trasition()
    .duration(1000)
    .call(leftAxis)
    return yAxis
}
function renderCircles(circlesGroup, newXScale, newYScale, chooseXAxis, chooseYAxis) {
    // console.log(chooseX,chooseY)
    circlesGroup.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chooseXAxis]))
    .attr("cy", d => newYScale(d[chooseYAxis]));
    
    circlesGroup.selectAll("text")
    .transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chooseXAxis]))
    .attr("y", d => newYScale(d[chooseYAxis]));

    return circlesGroup;
}
//Update Circles 
function updateToolTip(chooseXAxis, chooseYAxis, circlesGroup) {

    let label = "";
  
    if (chooseXAxis == "poverty") {
        label = "In Poverty(%)";
    }else if(chooseXAxis == "age"){
        label = "Age (Median)"
    }else if(chooseXAxis == "income"){
        label = "Household Income (Median)";
    }else{
        label = "X Error"
    } 

    if (chooseYAxis == "healthcare") {
        label = label + " vs Lacks Healthcare (%)";
    } 
    else if(chooseYAxis == "obesity"){
        label = label + " vs Obesity (%)"
    }
    else if(chooseYAxis == "smokes"){
        label = label + " vs Smokes (%)";
    }else{
        label = label + "Y Error"
    }
  
    // console.log(label)
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        // console.log(d[chooseX],d[chooseY])    
        return (`${d.state}<br>${label} <br> ${chooseXAxis}: ${d[chooseXAxis]} <br> ${chooseYAxis}: ${d[chooseYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
    //Import Data
d3.csv("assets/data/data.csv").then(function(input_data){
    //Parse Data
    input_data.forEach(function(data){
        data.poverty=+data.poverty
        data.age=+data.age
        data.income=+data.income
        data.healthcare=+data.healthcare
        data.obesity=+data.obesity
        data.smokes=+data.smokes
    })
    console.log(input_data)
    // functions that returns the xLinearScale and the yLinearScale
    let xLinearScale = XScale(input_data, chooseXAxis);
    let yLinearScale = YScale(input_data, chooseYAxis);
  
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    let xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartheight})`)
    .call(bottomAxis);
  
    // append y axis
    let yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
    .data(input_data)
    .enter()
    .append("g")

    circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chooseXAxis]))
    .attr("cy", d => yLinearScale(d[chooseYAxis]))
    .attr("r", 20)
    .attr("fill", "purple")
    .attr("opacity", ".5")
    .attr("class","stateCircle")

    // let texts = chartGroup.selectAll("text")
    circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chooseXAxis]))
    .attr("y",d => yLinearScale(d[chooseYAxis]))
    .attr("class","stateText")
  
    // Create group for X Axis labels
    let xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartwidth / 2}, ${chartheight + 20})`);
    // Create group for Y Axis labels
    let yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");
    
    // append on X Axis 
    let povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .attr("class","xlabel")
    .classed("active", true)
    .text("In Poverty(%)");
  
    // append on X Axis 
    let ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .attr("class","xlabel")
    .classed("inactive", true)
    .text("Age (Median)");
    
    // append on X Axis 
    let incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .attr("class","xlabel")
    .classed("inactive", true)
    .text("Household Income (Median)");
  
    // append on Y Axis
    let healthcareLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartheight / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare (%)");
    
    // append on Y Axis
    let obesityLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (chartheight / 2))
    .attr("value", "obesity") // value to grab for event listener
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Obesity (%)");
    
    // append on Y Axis
    let smokesLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartheight / 2))
    .attr("value", "smokes") // value to grab for event listener
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Smokes (%)");
    
    // update tooltips
    circlesGroup = updateToolTip(chooseXAxis, chooseYAxis, circlesGroup);
  
    // X axis labels on click event
    d3.selectAll(".xlabel")
    .on("click", function() {
        // get selected value
        let value = d3.select(this)
        if (value.classed("inactive")) {
  
            chooseXAxis = value;
            // console.log(chooseX)

            // update X scale
            xLinearScale = xScale(input_data, chooseXAxis);
    
            // updates X axis 
            xAxis = renderXAxes(xLinearScale, xAxis);
            //   yAxis = renderYAxes(yLinearScale, yAxis);
    
            // updates circles with new Y values
            /* circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chooseXAxis, chooseYAxis); */
            d3.selectAll("circle")
            .each(function(){
                d3.select(this)
                    .transition()
                    .attr("cx",d=>newXScale(d[chooseXAxis]))
            })
            // update tooltips
            circlesGroup = updateToolTip(chooseXAxis, chooseYAxis, circlesGroup);

            // change classes to notice wich one is selected
            if (chooseXAxis === "age") {
                ageLabel.classed("active", true)
                .classed("inactive", false);
                povertyLabel.classed("active", false)
                .classed("inactive", true);
                incomeLabel.classed("active", false)
                .classed("inactive", true);
            } else if (chooseXAxis === "poverty") {
                ageLabel.classed("active", false)
                .classed("inactive", true);
                povertyLabel.classed("active", true)
                .classed("inactive", false);
                incomeLabel.classed("active", false)
                .classed("inactive", true);
            } else {
                ageLabel.classed("active", false)
                .classed("inactive", true);
                povertyLabel.classed("active", false)
                .classed("inactive", true);
                incomeLabel.classed("active", true)
                .classed("inactive", false);
            }
        }
    });

    
    // Y axis labels on click event
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        // get selected value
        let value = d3.select(this).attr("value");
        if (value !== chooseYAxis) {
  
            chooseYAxis = value;
            // console.log(chooseY)

            // updates Y scale
            yLinearScale = yScale(input_data, chooseYAxis);
    
            // updates Y axis
            yAxis = renderYAxes(yLinearScale, yAxis);
    
            // updates circles with new Y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chooseXAxis, chooseYAxis);

            // update tooltips
            circlesGroup = updateToolTip(chooseXAxis, chooseYAxis, circlesGroup);

            // change classes to notice wich one is selected
            if (chooseYAxis === "healthcare") {
                healthcareLabel.classed("active", true)
                .classed("inactive", false);
                obesityLabel.classed("active", false)
                .classed("inactive", true);
                smokesLabel.classed("active", false)
                .classed("inactive", true);
            } else if (chooseYAxis === "obesity") {
                healthcareLabel.classed("active", false)
                .classed("inactive", true);
                obesityLabel.classed("active", true)
                .classed("inactive", false);
                smokesLabel.classed("active", false)
                .classed("inactive", true);
            } else {
                healthcareLabel.classed("active", false)
                .classed("inactive", true);
                obesityLabel.classed("active", false)
                .classed("inactive", true);
                smokesLabel.classed("active", true)
                .classed("inactive", false);
            }
        }
    });
    
    /* //Scale Functions
    let xLinearScale=XScale(data,chooseXAxis)
    let yLinearScale=YScale(data,chooseYAxis)
    
    //Axis Functions
    let bottomAxis=d3.axisBottom(xLinearScale)
    let leftAxis=d3.axisLeft(yLinearScale)
    
    //Append Axes to Chart
    let xAxis=chartGroup.append("g")
        .attr("class","x-axis")
        .attr("transform",`translate(0,${chartheight})`)
        .call(bottomAxis)
    let yAxis=chartGroup.append("g")
        .attr("class","y-axis")
        .call(leftAxis)
    //Create Circles
    let circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("g")

    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chooseXAxis]))
        .attr("cy", d => yLinearScale(d[chooseYAxis]))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5")
    circlesGroup.append("text")
        .text(d=>d.abbr)
        .attr("x",d=>xLinearScale(d[chooseXAxis]))
        .attr("y",d=>yLinearScale(d[chooseYAxis]))
    
    let xLabelGroup= chartGroup.append("g")
    .attr("transform",`translate(${chartwidth/2},${chartheight+20})`)
    let yLabelGroup= chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    //Appending all X axis 
    let poverty=xLabelGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value","poverty")
        .attr("class","active")
        .text("Poverty %")
    let age=xLabelGroup.append("text")
        .attr("x",0)
        .attr("y",40)
        .attr("value","age")
        .attr("class","inactive")
        .text("Age (Median")
    let income=xLabelGroup.append("text")
        .attr("x",0)
        .attr("y",60)
        .attr("value","income")
        .attr("class","inactive")
        .text("Income (Median)")
    //Appending all Y Axis
    let healthcare=yLabelGroup.append("text")
        .attr("y",0-margin.left+40)
        .attr("x",0-(chartheight/2))
        .attr("value","healthcare")
        .attr("dy","1em")
        .attr("class","active")
        .text("Lacks Healthcare %")
    let obesity=yLabelGroup.append("text")
        .attr("y",0-margin.left+20)
        .attr("x",0-(chartheight/2))
        .attr("value","obesity")
        .attr("dy","1em")
        .attr("class","inactive")
        .text("Obesity %")
    let smokes=yLabelGroup.append("text")
        .attr("y",0-margin.left)
        .attr("x",0-(chartheight/2))
        .attr("value","smokes")
        .attr("dy","1em")
        .attr("class","inactive")
        .text("Smokes %")
    
    circlesGroup=updateToolTip(chooseXAxis,chooseYAxis,circlesGroup)

    //xLabel on click event
    xLabelGroup.selectAll("text")
        .on("click",function(){
            let value=d3.select(this).attr("valule")
            if (value!== chooseXAxis){
                chooseXAxis=value
                xLinearScale=XScale(data,chooseXAxis)
                xAxis=renderXAxes(xLinearScale,xAxis)
                circlesGroup=renderCircles(circlesGroup,xLinearScale,yLinearScale,chooseXAxis,chooseYAxis)
                circlesGroup=updateToolTip(chooseXAxis,chooseYAxis,circlesGroup)
                if (chooseXAxis === "age") {
                    ageLabel.classed("active", true)
                    .classed("inactive", false);
                    poverty.classed("active", false)
                    .classed("inactive", true);
                    income.classed("active", false)
                    .classed("inactive", true);
                } else if (chooseXAxis === "poverty") {
                    age.classed("active", false)
                    .classed("inactive", true);
                    poverty.classed("active", true)
                    .classed("inactive", false);
                    income.classed("active", false)
                    .classed("inactive", true);
                } else {
                    age.classed("active", false)
                    .classed("inactive", true);
                    poverty.classed("active", false)
                    .classed("inactive", true);
                    income.classed("active", true)
                    .classed("inactive", false);
                }
            }
        })
        //YAxis on click event
        yLabelGroup.selectAll("text")
        .on("click",function(){
            let value=d3.select(this).attr("value")
            if (value!== chooseYAxis){
                chooseYAxis =value
                yLinearScale=YScale(data,chooseYAxis)
                yAxis=renderYAxes(yLinearScale,yAxis)
                circlesGroup=renderCircles(circlesGroup,xLinearScale,yLinearScale,chooseXAxis,chooseYAxis)
                circlesGroup=updateToolTip(chooseXAxis,chooseYAxis,circlesGroup)
                if (chooseY === "healthcare") {
                    healthcare.classed("active", true)
                    .classed("inactive", false);
                    obesity.classed("active", false)
                    .classed("inactive", true);
                    smokesLabel.classed("active", false)
                    .classed("inactive", true);
                } else if (chooseY === "obesity") {
                    healthcare.classed("active", false)
                    .classed("inactive", true);
                    obesity.classed("active", true)
                    .classed("inactive", false);
                    smokes.classed("active", false)
                    .classed("inactive", true);
                } else {
                    healthcare.classed("active", false)
                    .classed("inactive", true);
                    obesity.classed("active", false)
                    .classed("inactive", true);
                    smokes.classed("active", true)
                    .classed("inactive", false);
                }
            }
        })
    
}) */
})
.catch(e=>{
    console.log(e)
})