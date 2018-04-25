var dataset = [];
var previoussecond = 0;
var currentsecond = 0;
var dotsize = 10;
var legendsize = 10;
var traillength = 5;
//var colors = [d3.rgb("#9e0142"), d3.rgb("#d53e4f"), d3.rgb("#f46d43"), d3.rgb("#fdae61"), d3.rgb("#fee08b"), d3.rgb("#e6f598"), d3.rgb("#abdda4"), d3.rgb("#66c2a5"), d3.rgb("#3288bd"), d3.rgb("#5e4fa2")];
var colors = [d3.rgb("#a6cee3"), d3.rgb("#1f78b4"), d3.rgb("#b2df8a"), d3.rgb("#33a02c"), d3.rgb("#fb9a99"), d3.rgb("#e31a1c"), d3.rgb("#fdbf6f"), d3.rgb("#ff7f00"), d3.rgb("#cab2d6"), d3.rgb("#6a3d9a")];

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

var svg;
var gamelength = 0;

window.onload = function() {
    document.getElementById("options").style.top = ((legendsize * 2 + 6) * 10) + 90 + "px";
    document.getElementById("options").style.height = (660 - ((legendsize * 2 + 6) * 10)) + "px";
}

d3.csv("playerdata.csv", function(data) {
	data.forEach(function(d) {
		var index = +d.second;
		while (index >= dataset.length) {
			var asdf = [];
			dataset.push(asdf);
		}
		dataset[index].push({id:1, name:d.p0hn, x:+d.p0x, y:+d.p0y, team:+d.p0t, hp:+d.p0hp});
		dataset[index].push({id:2, name:d.p1hn, x:+d.p1x, y:+d.p1y, team:+d.p1t, hp:+d.p1hp});
		dataset[index].push({id:3, name:d.p2hn, x:+d.p2x, y:+d.p2y, team:+d.p2t, hp:+d.p2hp});
		dataset[index].push({id:4, name:d.p3hn, x:+d.p3x, y:+d.p3y, team:+d.p3t, hp:+d.p3hp});
		dataset[index].push({id:5, name:d.p4hn, x:+d.p4x, y:+d.p4y, team:+d.p4t, hp:+d.p4hp});
		dataset[index].push({id:6, name:d.p5hn, x:+d.p5x, y:+d.p5y, team:+d.p5t, hp:+d.p5hp});
		dataset[index].push({id:7, name:d.p6hn, x:+d.p6x, y:+d.p6y, team:+d.p6t, hp:+d.p6hp});
		dataset[index].push({id:8, name:d.p7hn, x:+d.p7x, y:+d.p7y, team:+d.p7t, hp:+d.p7hp});
		dataset[index].push({id:9, name:d.p8hn, x:+d.p8x, y:+d.p8y, team:+d.p8t, hp:+d.p8hp});
		dataset[index].push({id:10, name:d.p9hn, x:+d.p9x, y:+d.p9y, team:+d.p9t, hp:+d.p9hp});
	});
	
	gamelength = dataset.length - 1;
	document.getElementById("inputtime").max = gamelength;
	document.getElementById("inputTL").max = gamelength;
	continuesetup();
	update();
});

function continuesetup() {
	console.log(dataset);
	
	svg = d3.select('.chart').append('svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
	for (i = 0; i < dataset.length - 1; i++) {
		var data = dataset[i];
		var dots = svg.selectAll(".dot" + i).data(data).enter();
	
		dots.append("rect")
			.filter(function(d) {return d.hp <= 0;})
			.attr("id", "dot" + i)
			.attr("heroid", function(d) {return d.id;})
			.attr("class", "dot")
			.attr("cx", xMap)
			.attr("cy", yMap)
			.attr("x", xMap2)
			.attr("y", yMap2)
			.attr("width", dotsize * 2)
			.attr("height", dotsize * 2)
			.style("fill", function(d) {return color(d);})
			.style("stroke", function(d) {return stroke(d);})
			.style("stroke-width", dotsize * 0.4)
			.style("display", "none");
			//.attr("transform", "rotate(45)");
		
		dots.append("circle")
			.filter(function(d) {return d.hp > 0;})
			.attr("id", "dot" + i)
			.attr("heroid", function(d) {return d.id;})
			.attr("class", "dot")
			.attr("r", dotsize)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.style("fill", function(d) {return color(d);})
			.style("stroke", function(d) {return stroke(d);})
			.style("stroke-width", dotsize * 0.4)
			.style("display", "none");
	}
}

function update() {
	var data = dataset[currentsecond];
	
	svg.selectAll("#dot" + previoussecond)
		.style("display", "none");
	svg.selectAll("#dot" + currentsecond)
		.style("display", "inline");
	
	d3.selectAll("path").remove();
	//draw trails!
	var stars = [[], [], [], [], [], [], [], [], [], []];
	for (i = 0; i <= traillength; i++) {
		svg.selectAll("#dot" + (currentsecond - i)).each(function(item, index) {
			if (d3.select(this).attr("cx") < 0 || d3.select(this).attr("cy") < 0) {
				return;
			}
			stars[d3.select(this).attr("heroid")-1].push({x:d3.select(this).attr("cx"), y:d3.select(this).attr("cy"), color:d3.select(this).style("fill")});
		});
	}
	
	var link = d3.svg.line()
		.x(function(d) {return d.x;})
		.y(function(d) {return d.y;})
		.interpolate("linear");
	
	if (traillength > 0) {
		stars.forEach(function(item, index) {
			if (item.length == 0) {
				return;
			}
			svg.append("path")
				.attr("d", link(item))
				.attr("class", "link")
				.style("stroke", item[0].color)
				.style("stroke-width", 5);
		});
	}
	
	d3.selectAll(".legend").remove();
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
    previoussecond = currentsecond;
    currentsecond = document.getElementById("inputtime").value;
    document.getElementById("minute").value = String(Math.floor(currentsecond/60)).padStart(2, "0");
    document.getElementById("second").value = String(currentsecond%60).padStart(2, "0");
    //d3.select("svg").remove();
    update();
}

function updatetime2() {
    previoussecond = currentsecond;
    var s = +document.getElementById("second").value;
    var m = +document.getElementById("minute").value;
    
    if (s < 0) {
        s = 0;
        document.getElementById("second").value = "00";
    }
    if (s > 59) {
        s = 59;
        document.getElementById("second").value = "59";
    }
    if (m < 0) {
        m = 0;
        document.getElementById("minute").value = "00";
    }
    var s2 = (m * 60) + s;
    if (s2 > gamelength) {
        s2 = gamelength;
        document.getElementById("minute").value = String(Math.floor(s2/60)).padStart(2, "0");
        document.getElementById("second").value = String(s2%60).padStart(2, "0");
    }
    currentsecond = s2;
    document.getElementById("inputtime").value = s2;
    update();
}

function updateTL() {
    traillength = document.getElementById("inputTL").value;
    document.getElementById("TL").value = traillength;
    //d3.select("svg").remove();
    update();
}

function updateTL2() {
    var tl = +document.getElementById("TL").value;
    
    if (tl < 0) {
        tl = 0;
        document.getElementById("TL").value = "0";
    }
    if (tl > gamelength) {
        tl = gamelength;
        document.getElementById("TL").value = tl;
    }
    
    traillength = tl;
    document.getElementById("inputTL").value = tl;
    update();
}