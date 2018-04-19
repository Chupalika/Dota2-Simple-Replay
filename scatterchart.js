var dataset = [];
var currentsecond = 0;

d3.csv("data.csv", function(data) {
	data.forEach(function(d) {
		var index = +d.second;
		while (index >= dataset.length) {
			var asdf = [];
			dataset.push(asdf);
		}
		dataset[index].push({name:d.hero1, x:+d.h1x, y:+d.h1y});
		dataset[index].push({name:d.hero2, x:+d.h2x, y:+d.h2y});
		dataset[index].push({name:d.hero3, x:+d.h3x, y:+d.h3y});
		dataset[index].push({name:d.hero4, x:+d.h4x, y:+d.h4y});
		dataset[index].push({name:d.hero5, x:+d.h5x, y:+d.h5y});
		dataset[index].push({name:d.hero6, x:+d.h6x, y:+d.h6y});
		dataset[index].push({name:d.hero7, x:+d.h7x, y:+d.h7y});
		dataset[index].push({name:d.hero8, x:+d.h8x, y:+d.h8y});
		dataset[index].push({name:d.hero9, x:+d.h9x, y:+d.h9y});
		dataset[index].push({name:d.hero10, x:+d.h10x, y:+d.h10y});
		
		/*
		d.second = +d.second;
		d.h1x = +d.h1x;
		d.h1y = +d.h1y;
		d.h2x = +d.h2x;
		d.h2y = +d.h2y;
		d.h3x = +d.h3x;
		d.h3y = +d.h3y;
		d.h4x = +d.h4x;
		d.h4y = +d.h4y;
		d.h5x = +d.h5x;
		d.h5y = +d.h5y;
		d.h6x = +d.h6x;
		d.h6y = +d.h6y;
		d.h7x = +d.h7x;
		d.h7y = +d.h7y;
		d.h8x = +d.h8x;
		d.h8y = +d.h8y;
		d.h9x = +d.h9x;
		d.h9y = +d.h9y;
		d.h10x = +d.h10x;
		d.h10y = +d.h10y;
		*/
	});
	//dataset = data.map(function(d) {return [ +d["h1x"], +d["h1y"] ]; }).filter(function(d) {return d[0]>0});
	
	document.getElementById("inputtime").max = dataset.length - 1;
	update();
});

function update() {
	console.log(dataset);
	
	var data = dataset[currentsecond];
	
	var margin = {top: 40, right: 40, bottom: 40, left: 40};
	var width = 820 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	
	var xValue = function(d) {return d.x;};
	var xScale = d3.scale.linear().range([0, width-120]).domain([68, 185]);
	var xMap = function(d) {return xScale(xValue(d));}
	var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
	
	var yValue = function(d) {return d.y;};
	var yScale = d3.scale.linear().range([height, 0]).domain([65, 182]);
	var yMap = function(d) {return yScale(yValue(d));}
	var yAxis = d3.svg.axis().scale(yScale).orient('left');
	
	var cValue = function(d) {return d.name;}
	var color = d3.scale.category10();
	
	var svg = d3.select('.chart').append('svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	
	/*
	svg.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'x axis')
		.call(xAxis);
	
	svg.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'y axis')
		.call(yAxis);
	*/
	
	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 10)
		.attr("cx", xMap)
		.attr("cy", yMap)
		.style("fill", function(d) {return color(cValue(d));});
	
	// draw legend
	var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	// draw legend colored rectangles
	legend.append("rect")
		.attr("x", width - 70)
		.attr("width", 16)
		.attr("height", 16)
		.style("fill", color);

	// draw legend text
	legend.append("text")
		.attr("x", width - 50)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "start")
		.text(function(d) { return d;})
};

function updatetime() {
    currentsecond = document.getElementById("inputtime").value;
    element = document.getElementById("time");
    element.innerHTML = currentsecond;
    d3.select("svg").remove();
    update();
}

/*
	var margin = {top: 20, right: 15, bottom: 60, left: 60}
	  , width = 960 - margin.left - margin.right
	  , height = 500 - margin.top - margin.bottom;
	
	var x = d3.scale.linear()
	          .domain([d3.min(data, function(d) { return d[0]; }),
	                   d3.max(data, function(d) { return d[0]; })])
	          .range([ 0, width ]);
	
	var y = d3.scale.linear()
		      .domain([ d3.min(data, function(d) { return d[1]; }),
	                  d3.max(data, function(d) { return d[1]; })])
		      .range([ height, 0 ]);
	
	var chart = d3.select('body')
	.append('svg:svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.attr('class', 'chart')
	
	var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main')
	
	// draw the x axis
	var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');
	
	main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);
	
	// draw the y axis
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');
	
	main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis);
	
	var g = main.append("svg:g");
	
	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", xMap)
		.attr("cy", yMap)
		.style("fill", function(d) { return color(cValue(d));});
	
	g.selectAll("scatter-dots")
	  .data(data)
	  .enter().append("svg:circle")
	      .attr("cx", function (d,i) { return x(d[0]); } )
	      .attr("cy", function (d) { return y(d[1]); } )
	      .attr("r", 8);
});
*/