var dataset = [];
var currentsecond = 0;
var dotsize = 10;
var legendsize = 10;
var traillength = 10;
//var colors = [d3.rgb("#9e0142"), d3.rgb("#d53e4f"), d3.rgb("#f46d43"), d3.rgb("#fdae61"), d3.rgb("#fee08b"), d3.rgb("#e6f598"), d3.rgb("#abdda4"), d3.rgb("#66c2a5"), d3.rgb("#3288bd"), d3.rgb("#5e4fa2")];
var colors = [d3.rgb("#a6cee3"), d3.rgb("#1f78b4"), d3.rgb("#b2df8a"), d3.rgb("#33a02c"), d3.rgb("#fb9a99"), d3.rgb("#e31a1c"), d3.rgb("#fdbf6f"), d3.rgb("#ff7f00"), d3.rgb("#cab2d6"), d3.rgb("#6a3d9a")];

window.onload = function() {
    document.getElementById("options").style.top = ((legendsize * 2 + 6) * 10) + 90 + "px";
    document.getElementById("options").style.height = (660 - ((legendsize * 2 + 6) * 10)) + "px";
}

d3.csv("data.csv", function(data) {
	data.forEach(function(d) {
		var index = +d.second;
		while (index >= dataset.length) {
			var asdf = [];
			dataset.push(asdf);
		}
		dataset[index].push({id:1, name:d.hero1, x:+d.h1x, y:+d.h1y, team:+d.h1t, hp:+d.h1hp});
		dataset[index].push({id:2, name:d.hero2, x:+d.h2x, y:+d.h2y, team:+d.h2t, hp:+d.h2hp});
		dataset[index].push({id:3, name:d.hero3, x:+d.h3x, y:+d.h3y, team:+d.h3t, hp:+d.h3hp});
		dataset[index].push({id:4, name:d.hero4, x:+d.h4x, y:+d.h4y, team:+d.h4t, hp:+d.h4hp});
		dataset[index].push({id:5, name:d.hero5, x:+d.h5x, y:+d.h5y, team:+d.h5t, hp:+d.h5hp});
		dataset[index].push({id:6, name:d.hero6, x:+d.h6x, y:+d.h6y, team:+d.h6t, hp:+d.h6hp});
		dataset[index].push({id:7, name:d.hero7, x:+d.h7x, y:+d.h7y, team:+d.h7t, hp:+d.h7hp});
		dataset[index].push({id:8, name:d.hero8, x:+d.h8x, y:+d.h8y, team:+d.h8t, hp:+d.h8hp});
		dataset[index].push({id:9, name:d.hero9, x:+d.h9x, y:+d.h9y, team:+d.h9t, hp:+d.h9hp});
		dataset[index].push({id:10, name:d.hero10, x:+d.h10x, y:+d.h10y, team:+d.h10t, hp:+d.h10hp});
	});
	
	document.getElementById("inputtime").max = dataset.length - 1;
	update();
});

function update() {
	console.log(dataset);
	
	var data = dataset[currentsecond];
	
	var margin = {top: 40, right: 40, bottom: 40, left: 40};
	var width = 830 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	
	var xValue = function(d) {return d.x;};
	var xScale = d3.scale.linear().range([0, width-120]).domain([68, 185]);
	var xMap = function(d) {return xScale(xValue(d));}
	var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
	
	var yValue = function(d) {return d.y;};
	var yScale = d3.scale.linear().range([height, 0]).domain([65, 182]);
	var yMap = function(d) {return yScale(yValue(d));}
	var yAxis = d3.svg.axis().scale(yScale).orient('left');
	
	var xMap2 = function(d) {return xScale(xValue(d)) - dotsize;}
	var yMap2 = function(d) {return yScale(yValue(d)) - dotsize;}
	
	var color = function(d) {return colors[d.id-1];};
	var stroke = function(d) {return ["", "", "green", "red"][d.team];}
	
	var svg = d3.select('.chart').append('svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	
	var dots = svg.selectAll(".dot").data(data).enter();
	
	dots.append("rect")
		.filter(function(d) {return d.hp <= 0;})
		.attr("class", "dot")
		.attr("x", xMap2)
		.attr("y", yMap2)
		.attr("width", dotsize * 2)
		.attr("height", dotsize * 2)
		.style("fill", function(d) {return color(d);})
		.style("stroke", function(d) {return stroke(d);})
		.style("stroke-width", dotsize * 0.4);
		//.attr("transform", "rotate(45)");
	
	dots.append("circle")
		.filter(function(d) {return d.hp > 0;})
		.attr("class", "dot")
		.attr("r", dotsize)
		.attr("cx", xMap)
		.attr("cy", yMap)
		.style("fill", function(d) {return color(d);})
		.style("stroke", function(d) {return stroke(d);})
		.style("stroke-width", dotsize * 0.4);
	
	//draw trails!
	var stars = [[], [], [], [], [], [], [], [], [], []];
	for (i = 0; i <= traillength; i++) {
		if (currentsecond >= 1) {
			var data2 = dataset[currentsecond-i];
			var dots2 = svg.selectAll(".dot" + i).data(data2).enter();
			data2.forEach(function(item, index) {stars[index].push(item);});
			
			dots2.append("circle")
				.filter(function(d) {return d.hp > 0;})
				.attr("class", "dot")
				.attr("r", 2)
				.attr("cx", xMap)
				.attr("cy", yMap)
				.style("fill", function(d) {return color(d);})
				.style("stroke-width", 0);
			
		}
	}
	
	var link = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");
	
	stars.forEach(function(item, index) {
		asdf = item[0];
		svg.append("path")
			.attr("d", link(item))
			.attr("class", "link")
			.style("stroke", color(asdf))
			.style("stroke-width", 5);
	});
	
	// draw legend
	var legend = svg.selectAll(".legend")
		.data(data)
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + (i-1) * (legendsize * 2 + 6) + ")"; });

	legend.append("rect")
		.filter(function(d) {return d.hp <= 0;})
		.attr("x", width - 70)
		.attr("width", legendsize * 2)
		.attr("height", legendsize * 2)
		.style("fill", color)
		.style("stroke", function(d) {return stroke(d);})
		.style("stroke-width", legendsize * 0.4);;
	
	legend.append("circle")
		.filter(function(d) {return d.hp > 0;})
		.attr("cx", width - 70 + legendsize)
		.attr("cy", legendsize)
		.attr("r", legendsize)
		.style("fill", color)
		.style("stroke", function(d) {return stroke(d);})
		.style("stroke-width", legendsize * 0.4);;

	// draw legend text
	legend.append("text")
		.attr("x", width - 65 + (legendsize * 2))
		.attr("y", legendsize)
		.attr("dy", ".35em")
		.style("text-anchor", "start")
		.text(function(d) { return d.name;})
};

function updatetime() {
    currentsecond = document.getElementById("inputtime").value;
    document.getElementById("minute").innerHTML = String(Math.floor(currentsecond/60)).padStart(2, "0");
    document.getElementById("second").innerHTML = String(currentsecond%60).padStart(2, "0");
    d3.select("svg").remove();
    update();
}

function updateTL() {
    traillength = document.getElementById("inputTL").value;
    document.getElementById("TL").innerHTML = traillength;
    d3.select("svg").remove();
    update();
}