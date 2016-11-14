var subjectHistogram = {
	width: 0,
	height: 0,
	initialize: function(){
		var self = this;
		var divWidth = $("#subj-histogram").width();
		var divHeight = $("#subj-histogram").height();
		var margin = {right: 40, left: 50, top: 30, bottom: 30},
			width = divWidth - margin.right - margin.left,
			height = divHeight - margin.top - margin.bottom;
		self.width = width;
		self.height = height;
		var svg = d3.select("#svg-subj-histogram")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("id", "g-subj-histogram")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		self.render();
	},
	render: function(){
		var self = this;
		var svg = d3.select("#g-subj-histogram");
		var width = self.width;
		var height = self.height;
		d3.csv("datasets/Rank.csv", function(data){
			var univArray = [];
			var formerSchoolName = "";
			for(var i = 0;i < data.length;i++){
				if(data[i]["School Name"] != formerSchoolName){
					var univObj = new Object();
					univObj.school_name = data[i]["School Name"];
					univObj.global_ranking = +data[i]["Global Ranking"];
					univObj.global_scores = +data[i]["Global Scores"];
					univArray.push(univObj);
				}
				formerSchoolName = data[i]["School Name"];
			}
			var rankMax = d3.max(univArray, function(d){
				return d.global_ranking;
			});
			var scoreMax = d3.max(univArray, function(d){
				return +d.global_scores;
			});
			console.log("scoreMax", scoreMax);
			var x = d3.scale.linear()
			    .domain([0, rankMax + 20])
			    .range([0, width]);
			var y = d3.scale.linear()
			    .domain([100, 0])
			    .range([0, height]);
			console.log(y(scoreMax));
			svg.selectAll('.univ-bar')
			.data(univArray)
			.enter()
			.append("rect")
			.attr("class", "univ-bar")
			.attr("id", function(d,i){
				var idName = d.school_name.replace(' ','_');
				return idName;
			})
			.attr("width", function(d,i){
				return 3;
			})
			.attr("height", function(d,i){
				return height - y(d.global_scores);
			})
			.attr("x", function(d,i){
				return x(d.global_ranking);
			})
			.attr("y", function(d,i){
				return y(d.global_scores);
			});
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
			svg.append("g")
	            .attr("class", "x axis")
	            .attr("transform", "translate(0," + height + ")")
	            .call(xAxis)
	            .append("text")
	            .attr("x", width)
	           	.attr("y", 22)
	           	.style("text-anchor", "end")
	            .text("Rank");
	        svg.append("g")
	            .attr("class", "y axis")
	            .call(yAxis)
	           	.append("text")
	           	.attr("y", 16)
	           	.style("text-anchor", "end")
	            .attr("transform", "rotate(-90)")
	            .text("Score");

		});
	},
	highlight: function(){
		
	}
}