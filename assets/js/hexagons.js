//The color of each hexagon
var color = ["#9cd484", "#cdea95", "#ffedad", "#f7fbc1","#bce28b","#c7e791","#d0eb98","#e8f5ad","#bde38c","#51b275",
            "#afdc87","#fefecb","#fed392","#feda98","#fffac6","#feeeaf","#faa775","#fedc99","#f9a374","#e6f5ac",
            "#f1f9b9","#feeeaf","#fbfdc7","#fbfdc7","#fff4bc","#e7695a","#feebaa","#fedc99","#feca8a","#aadb86",
            "#a3d685","#fff8c1","#fef0b4","#c2e58e","#f6fbbf","#fef0b4","#fff9c3","#fbfdc6","#feebaa","#e1f3a5",
            "#e1f2a3","#fcb77e","#ffefb2","#fdfdca","#fee4a0","#fffbc3","#f8fcc3","#fcbb80","#f1f9b9","#82c981",
            "#a8da86","#ffedad","#f9a173","#fed392","#fede9b","#fedb98","#f8fcc3","#fdc285","#fcbb80","#dbef9f",
            "#fffac6","#fee29e","#f18064","#de5952","#fbb57e","#f9fdc3","#fff8c1","#fee29e","#fef0b4","#9fd585",
            "#bde38c","#fff3b9","#fee3a0","#f18064","#b73351","#feeaa8","#fffdc7","#f7fbc1","#f7fbc1","#cfeb97",
            "#feeaa8","#fbfdc7","#fffecb","#fee6a2","#fbb07a","#fffdc7","#d5ec9b","#bce28b","#daf09e","#74c27e",
            "#7dc880", "#e3f3a5","#abdb87","#d0eb98","#d3ec9a","#c8e793","#97d284","#82c981","#90ce84","#80c881"]

///////////////////////////////////////////////////////////////////////////
////////////// Initiate SVG and create hexagon centers ////////////////////
///////////////////////////////////////////////////////////////////////////

//Function to call when you mouseover a node
function mover(d) {
  var el = d3.select(this)
		.transition()
		.duration(10)		  
		.style("fill-opacity", 0.3)
		;
}

//Mouseout function
function mout(d) { 
	var el = d3.select(this)
	   .transition()
	   .duration(1000)
	   .style("fill-opacity", 1)
	   ;
};

//svg sizes and margins
var margin = {
    top: 110,
    right: 100,
    bottom: -90,
    left: 70
};

var width = 800;
var height = 800;

//The number of columns and rows of the heatmap
var MapColumns = 10,
	MapRows = 10;
	
//The maximum radius the hexagons can have to still fit the screen
var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
			height/((MapRows + 1/3) * 1.5)]);

//Set the new height and width of the SVG based on the max possible
width = MapColumns*hexRadius*Math.sqrt(3);
heigth = MapRows*1.5*hexRadius+0.5*hexRadius;

//Set the hexagon radius
var hexbin = d3.hexbin()
    	       .radius(hexRadius);

//Calculate the center positions of each hexagon	
var points = [];
for (var i = 0; i < MapRows; i++) {
    for (var j = 0; j < MapColumns; j++) {
        var x = hexRadius * j * Math.sqrt(3)
        //Offset each uneven row by half of a "hex-width" to the right
        if(i%2 === 1) x += (hexRadius * Math.sqrt(3))/2
        var y = hexRadius * i * 1.5
        points.push([x,y])
    }//for j
}//for i

//Create SVG element
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

///////////////////////////////////////////////////////////////////////////
////////////////////// Draw hexagons and color them ///////////////////////
///////////////////////////////////////////////////////////////////////////


//Start drawing the hexagons
svg.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
		return "M" + d.x + "," + d.y + hexbin.hexagon();
	})
    .attr("stroke", function (d,i) {
		return "#fff";
	})
    .attr("stroke-width", "1px")
    .style("fill", function (d,i) {
		return color[i];
	})
	.on("mouseover", mover)
	.on("mouseout", mout)
	;

//Append the horizontal Axis
// Create the scale
var x_axis = d3.scaleLinear()
    .domain([0, 9])         // This is what is written on the Axis: from 0 to 100
    .range([0, hexRadius*15.6]);       // This is where the axis is placed

// // Draw the axis
svg
  .append("g")
  .attr("transform", "translate(0,660)")      // This controls the vertical position of the Axis
  .call(d3.axisBottom(x_axis));

//Append the vertical Axis
// Create the scale
var y_axis = d3.scaleLinear()
    .domain([0, 9])         // This is what is written on the Axis: from 0 to 100
    .range([hexRadius*13.5,0]);       // This is where the axis is placed

// // Draw the axis
svg
  .append("g")
  .attr("transform", "translate(-45,0)")      // This controls the vertical position of the Axis
  .call(d3.axisLeft(y_axis));


//Creating the Gradient legend

var colors = [ 'rgba(183,51,81,255)', 'rgba(222,89,82,255)', 'rgba(231,105,90,255)','rgba(241,128,100,255)','rgba(249,161,115,255)',
'rgba(254,211,146,255)','rgba(254,240,180,255)','rgba(253,253,202,255)','rgba(241,249,185,255)','rgba(230,245,172,255)','rgba(208,235,152,255)',
 'rgba(171,219,135,255)','rgba(130,201,129,255)','rgba(125,200,128,255)','rgba(81,178,117,255)','rgb(81,147,82)'];

var grad = svg.append('defs')
  .append('linearGradient')
  .attr('id', 'grad')
  .attr('x1', '0%')
  .attr('x2', '0%')
  .attr('y1', '0%')
  .attr('y2', '100%');

grad.selectAll('stop')
  .data(colors)
  .enter()
  .append('stop')
  .style('stop-color', function(d){ return d; })
  .attr('offset', function(d,i){
    return 100 * (i / (colors.length - 1)) + '%';
  })

svg.append('rect')
  .attr('x', 780)
  .attr('y', -30)
  .attr('width', 20)
  .attr('height', 650)
  .attr('rx', 7)
  .attr('ry',7)
  .style('fill', 'url(#grad)');

//Create the markers for rejected approvals (red circles)
coordcir = [[0,0],[1,0],[2,0],[3,0],[4,0],
         [0.5,1],[1.5,1],[2.5,1],[3.5,1],[5.5,1],
         [0,2], [1,2],[2,2],[4,2],[6,2],[7,2],
         [0.5,3],[1.5,3],[3.5,3],[4.5,3],[6.5,3],[7.5,3],
         [3,4],[4,4],[6,4],[8,4],
         [1.5,5],[3.5,5],[5.5,5],[6.5,5],
         [1,6],[2,6],[4,6],[5,6],
         [0.5,7],[2.5,7],[3.5,7],[4.5,7],[7.5,7],[8.5,7],
         [0,8],[1,8],[2,8],[6,8],[9,8],
         [2.5,9],[3.5,9],[5.5,9],[7.5,9],[8.5,9],[9.5,9]
        ]

svg.selectAll("circle")
  .data(coordcir)
  .enter().append('circle')
  .attr('cx', function(d,i) {return d[0]*hexRadius*1.73})
  .attr('cy',function(d,i) {return d[1]*hexRadius*1.5})
  .attr('r', 10)
  .attr('stroke','#ff0000')
  .attr('stroke-width',4)
  .attr('fill','transparent')
  .on("mouseover", mover)
  .on("mouseout", mout)

//Create the markers for approvals rectangles (green rectangles)
coordrec = [[0,0],[1,0],[2,0],[4,0],[5,0],[6,0],[7,0],[9,0],
            [0.5,1],[1.5,1],[3.5,1],[4.5,1],[5.5,1],[6.5,1],[8.5,1],[9.5,1],
            [0,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[9,2],
            [0.5,3],[1.5,3],[4.5,3],[5.5,3],[6.5,3],[7.5,3],
            [0,4],[3,4],[4,4],[5,4],[6,4],[8,4],
            [1.5,5],[3.5,5],[4.5,5],[5.5,5],[6.5,5],[7.5,5],[9.5,5],
            [2,6],[3,6],[4,6],[5,6],[7,6],[9,6],
            [0.5,7],[1.5,7],[2.5,7],[3.5,7],[4.5,7],[7.5,7],[8.5,7],
            [0,8],[1,8],[2,8],[4,8],[6,8],
            [0.5,9],[1.5,9],[2.5,9],[5.5,9],[7.5,9],[8.5,9]]

svg.selectAll("rect")
  .data(coordrec)
  .enter().append('rect')
  .attr('x', function(d,i) {return d[0]*hexRadius*1.73-10})
  .attr('y',function(d,i) {return d[1]*hexRadius*1.5-10})
  .attr('width', 20)
  .attr('height',20)
  .attr('stroke','#088F8F')
  .attr('stroke-width',4)
  .attr('fill','transparent')
  .on("mouseover", mover)
  .on("mouseout", mout)

svg.append('rect')
  .attr('x', -10)
  .attr('y',-10)
  .attr('width', 20)
  .attr('height',20)
  .attr('stroke','#088F8F')
  .attr('stroke-width',4)
  .attr('fill','transparent')
  .on("mouseover", mover)
  .on("mouseout", mout)


//Append labels
svg.append('text')
  .attr('x',810)
  .attr('y',-10)
  .text("1.0")

svg.append('text')
  .attr('x',810)
  .attr('y',610)
  .text("0.0")

svg.append('text')
  .attr('x',120)
  .attr('y',-817)
  .text("distance from neurons in the neighbourhood")
  .attr('transform','rotate(90)')

// Create Legend
svg.append('circle')
    .attr('cx', 0)
    .attr('cy',-70)
    .attr('r', 7)
    .attr('stroke','#ff0000')
    .attr('stroke-width',4)
    .attr('fill','transparent')


svg.append('text')
  .attr('x',20)
  .attr('y',-65)
  .text("Credit Not Approved")

svg.append('rect')
  .attr('x', 190)
  .attr('y',-78)
  .attr('width', 14)
  .attr('height',14)
  .attr('stroke','#088F8F')
  .attr('stroke-width',4)
  .attr('fill','transparent')

svg.append('text')
  .attr('x',215)
  .attr('y',-65)
  .text("Credit Approved")

svg.append('rect')
  .attr('x',-13)
  .attr('y',-83)
  .attr('width', 357)
  .attr('height',25)
  .attr('rx', 4)
  .attr('ry',4)
  .attr('stroke','#d3d3d3')
  .attr('stroke-width',0.5)
  .attr('fill','transparent')

 

