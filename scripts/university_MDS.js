var universityMDS = {
	divHeight: 0,
	divWidth: 0,
	margin: null,
	initialize: function(){
		var self = this;
		var divWidth = $("#scatter-plot").width();
		var divHeight = $("#scatter-plot").height();
		self.divHeight = divHeight;
		self.divWidth = divWidth;
		var margin = {right: 40, left: 50, top: 30, bottom: 30},
			width = divWidth - margin.right - margin.left,
			height = divHeight - margin.top - margin.bottom;
		self.margin = margin;
		self.width = width;
		self.height = height;
		var svg = d3.select("#svg-scatter-plot")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("id", "g-univ-mds")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		self.render();
	},
	render: function(){
		var self = this;
		var margin = {
		  top: 10,
		  right: 10,
		  bottom: 30,
		  left: 10
		};
		var width = self.divWidth - margin.right - margin.left;
		var height = self.divHeight - margin.top - margin.bottom;
		var svg = d3.select("#g-univ-mds");
		var universityDic = dataCenter.universityDic;
		// svg.append("text")
		// .attr("class", "title-mds-plot")
		// .text("University MDS Plot")
		// .style('text-anchor', 'middle')
		// .attr("transform", "translate(" + (width / 2) + "," + 0 + ")");
		// var xScale = d3.scale.linear()
		// 	.range([0, width]);
		// var yScale = d3.scale.linear()
		// 	.range([height, 0]);
		// var xAxis = d3.svg.axis()
		//     .scale(xScale)
		//     .orient("bottom");
		// var yAxis = d3.svg.axis()
		//     .scale(yScale)
		//     .orient("left");
		// svg.append("g")
	 //      .attr("class", "x axis")
	 //      .attr("transform", "translate(0," + (height + margin.top) + ")")
	 //      .call(xAxis);
	 //    svg.append("g")
	 //      .attr("class", "y axis")
	 //      .attr("transform", "translate(0," + (margin.top) + ")")
	 //      .call(yAxis);
		var univDiffScoreDataObjArray = new Array();
		console.log(dataCenter.univDataSet); 
		for(var i = 0;i < dataCenter.univDataSet.length;i++){
			var univDiffScoreDataObj = new Object();
			var globalScore = dataCenter.univDataSet[i].global_scores;
			for(item in dataCenter.univDataSet[i]){
				if(item.indexOf("Score") != -1){
					univDiffScoreDataObj[item] = Math.round(dataCenter.univDataSet[i][item] - globalScore);					
				}
			}
			univDiffScoreDataObjArray.push(univDiffScoreDataObj);
		}
		univDiffScoreDataObjArray[0]["Agricultural SciencesScore"] = 0;
		/*计算两个学校之间的距离，距离的定义是看两个学校在学科分布的差别
		* 首先计算的是学校之间的各个学科与学校总成绩之间的分数差别
		* 学科分布之间的差别矩阵即为该分数的该别
		*/
		var distanceScoreMatrix = new Array();
		for(var i = 0;i < univDiffScoreDataObjArray.length;i++){
			distanceScoreMatrix[i] = new Array();
			for(var j = 0;j < univDiffScoreDataObjArray.length;j++){
				var sumDiff = 0;
				for(item in univDiffScoreDataObjArray[0]){
					var univDiffNumberI = 0;
					var univDiffNumberJ = 0;
					if(!(typeof univDiffScoreDataObjArray[i][item] === 'undefined')){
						univDiffNumberI = univDiffScoreDataObjArray[i][item];
					}
					if(!(typeof univDiffScoreDataObjArray[j][item] === 'undefined')){
						univDiffNumberJ = univDiffScoreDataObjArray[j][item];
					}
					sumDiff = sumDiff + Math.abs(univDiffNumberI - univDiffNumberJ);
				}
				distanceScoreMatrix[i][j] = sumDiff;
			}
		}
		var mdsByDistance = window["MDS"]["byDistance"];
		var coordinate = mdsByDistance(distanceScoreMatrix);
		/**
		 * 计算每个学校的星型图，将星型图按照对应的位置进行放置
		 */
		
		var labelMargin = 8;
		var scale = d3.scale.linear()
		  .domain([-50, 50])
		  .range([0, 20]);
		var star = d3.starPlot()
	      .width(width)
	      .accessors([
	        function(d) { return scale(d["Biology and BiochemistryScore"]); },
	        function(d) { return scale(d["ChemistryScore"]); },
	        function(d) { return scale(d["Clinical MedicineScore"]); },
	        function(d) { return scale(d["Computer ScienceScore"]); },
	        function(d) { return scale(d["Economics and BusinessScore"]); },
	        function(d) { return scale(d["EngineeringScore"]); },
	        function(d) { return scale(d["Environment/EcologyScore"]); },
	        function(d) { return scale(d["GeosciencesScore"]); },
	        function(d) { return scale(d["ImmunologyScore"]); },
	        function(d) { return scale(d["Materials ScienceScore"]); },
	        function(d) { return scale(d["MathematicsScore"]); },
	        function(d) { return scale(d["MicrobiologyScore"]); },
	        function(d) { return scale(d["Molecular Biology and GeneticsScore"]); },
	        function(d) { return scale(d["Neuroscience and BehaviorScore"]); },
	        function(d) { return scale(d["Pharmacology and ToxicologyScore"]); },
	       	function(d) { return scale(d["PhysicsScore"]); },
	        function(d) { return scale(d["Plant and Animal ScienceScore"]); },
	        function(d) { return scale(d["Psychiatry/PsychologyScore"]); },
	        function(d) { return scale(d["Social Sciences and Public HealthScore"]); },
	        function(d) { return scale(d["Space ScienceScore"]); },
	        function(d) { return scale(d["Agricultural SciencesScore"]); }
	      ])
	      .labels([
	      ])
	      .margin(margin)
	      .labelMargin(labelMargin);
	    for(var i = 0;i < univDiffScoreDataObjArray.length;i++){
	    	for(item in univDiffScoreDataObjArray[0]){
	    		if(typeof univDiffScoreDataObjArray[i][item] === 'undefined'){
	    			univDiffScoreDataObjArray[i][item] = 0;
	    		}
	    	}
	    }
		univDiffScoreDataObjArray.forEach(function(d, i) {
		  var xCoord = coordinate[i][0] * width;
		  var yCoord = height - coordinate[i][1] * height;
	      star.includeLabels(false);
	      var center = (width > height?width/2:height/2) * (-1);
	      d3.select('#g-univ-mds')
	        .append('g')
	        .attr('class', function(d){
	        	return universityDic[dataCenter.univDataSet[i].school_name];
	        })
	        .datum(d)
	        .call(star)
	        .attr('transform', "translate(" + (center + xCoord + margin.left) + "," + (center + yCoord + margin.top) + ")");
	    });
	},
	update: function(){ 
	},
	highlight_univ: function(univ_abbr_name){
		var svg = d3.select("#svg-scatter-plot");
		svg.select('.' + univ_abbr_name)
			.classed('univ-highlight', true);
	},
	unhighlight_univ: function(univ_abbr_name){
		var svg = d3.select("#svg-scatter-plot");
		svg.select('.' + univ_abbr_name)
			.classed('univ-highlight', false);
	},
	highlight_univ_array: function(univ_abbr_name_array){
		var svg = d3.select("#svg-scatter-plot");
		svg.selectAll('g').classed('univ-highlight', false);
		for(var i = 0;i < univ_abbr_name_array.length;i++){
			svg.select('.' + univ_abbr_name_array[i])
				.classed('univ-highlight', true);
		}
	}
}