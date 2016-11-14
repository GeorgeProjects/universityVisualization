var subjHistogram = {
	divHeight: 0,
	divWidth: 0,
	width: 0,
	height: 0,
	margin: null,
	initialize: function(){
		var self = this;
		var divWidth = $("#subject-histogram").width();
		var divHeight = $("#subject-histogram").height() - 30;
		self.divHeight = divHeight;
		self.divWidth = divWidth;
		var margin = {right: 40, left: 50, top: 30, bottom: 30},
			width = divWidth - margin.right - margin.left,
			height = divHeight - margin.top - margin.bottom;
		self.margin = margin;
		self.width = width;
		self.height = height;
		var svg = d3.select("#svg-subject-histogram")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("id", "g-subject-histogram")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		self.render();
	},
	render: function(){
		var self = this;
		var width = self.width;
		var height = self.height;
		/**
		 * [univDataSet description]
		 * @type {[object]}
		 * score and rank of each subject
		 * global_score and global_rank
		 */
		var allSubjArray = new Array();
		for(item in dataCenter.univDataSetObj){
			for(var i = 0;i < dataCenter.univDataSetObj[item].length;i++){
				if(!(typeof dataCenter.univDataSetObj[item][i].subjectScore === 'undefined')){
					dataCenter.univDataSetObj[item][i].school_name = item;
					allSubjArray.push(dataCenter.univDataSetObj[item][i]);
				}
			}
		}
		var extent = d3.extent(allSubjArray, function(d){
			return +d.subjectScore;
		});
		var y = d3.scale.linear()
		    .range([height, 0])
		    .domain(extent);
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
		var svg = d3.select('#g-subject-histogram');
		svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis);
		render_accord_univ(allSubjArray);
		/**
		 * [根据大学的名称进行渲染]
		 * @param  {[array]} all_subj_array []
		 * attributes:
		 * 1. schoolScore
		 * 2. school_name
		 * 3. subjectName
		 * 4. subjectScore
		 * @return {[null]}               
		 */
		function render_accord_univ(all_subj_array){
			var univDataSet = dataCenter.univDataSet;
			var universityDic = dataCenter.universityDic;
			svg.selectAll('.x.axis').remove();
			var x = d3.scale.ordinal()
	    		.rangeRoundBands([0, width], .2);
	    	var y = d3.scale.linear()
	    		.domain([0, 100])
	    		.range([height, 0]);
	    	x.domain(univDataSet.map(function(d){
				return universityDic[d.school_name];
			}));
	    	var xAxis = d3.svg.axis()
			    .scale(x)
			    .tickValues(x.domain()
			    	.filter(function(d, i) {
			    		console.log('i', i); 
			    		return !(i % 3); 
			    	}))
			    .orient("bottom");
			var yAxis = d3.svg.axis()
				.scale(y)
				.ticks(4)
				.orient("left");
			svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);
			var itemCount = 0;
			var subjectSum = 21;
			/**
			 * all_subj_array[array]
			 * object{
			 * 	schoolScore，subjectName，school_name，subjectScore
			 * }
			 */
			/**
			 * univDataSet[array]
			 * object{
			 * 	global_ranking, global_scores,school_name, xxRank, xxScore
			 * }
			 */
			console.log(univDataSet);
			for(item in univDataSet[0]){
				if((item.indexOf('Score') != -1) && (item != 'global_score')){
					var itemClass = item.split(' ')[0].replace('/','');
					var oneSubjectArray = new Array();
					for(var i = 0;i < all_subj_array.length;i++){
						if(all_subj_array[i].subjectName == item){
							oneSubjectArray.push(all_subj_array[i]);
						}
					}
					var bars = svg.selectAll("." + itemClass).data(oneSubjectArray);
					bars.enter().append("rect")
				        .attr("class", function(d,i){
				        	return "subject-bar " + itemClass + " " + universityDic[d.school_name];
				        })
				        .attr("x", function(d) { return x(universityDic[d.school_name]) + x.rangeBand()/subjectSum * itemCount; })
				        .attr("width", x.rangeBand()/subjectSum)
				        .attr("y", function(d) { 
				        	var yValue = d.subjectScore;
				        	if(typeof yValue === 'undefined'){
								yValue = 0;
							}
				        	return y(yValue); 
				        })
				  	    .attr("height", function(d,i,j) { 
				  	    	var yValue = d.subjectScore;
				  	    	if(typeof yValue === 'undefined'){
								yValue = 0;
							}
				  	    	return height - y(yValue); 
				  	    }); 
				  	bars.transition()
				  		.duration(1000)
				  		.attr("x", function(d) { return x(universityDic[d.school_name]) + x.rangeBand()/subjectSum * itemCount; })
				        .attr("width", x.rangeBand()/subjectSum)
				        .attr("y", function(d) { 
				        	var yValue = d.subjectScore;
				        	if(typeof yValue === 'undefined'){
								yValue = 0;
							}
				        	return y(yValue); 
				        })
				  	    .attr("height", function(d,i,j) { 
				  	    	var yValue = d.subjectScore;
				  	    	if(typeof yValue === 'undefined'){
								yValue = 0;
							}
				  	    	return height - y(yValue); 
				  	    });
				  	bars.exit().remove(); 
				  	itemCount = itemCount + 1;
				}
			}
			var brush = d3.svg.brush()
	    		.x(x)
	    		.on("brushstart", brushstart)
	    		.on("brush", brushmove)
        		.on("brushend", brushend);
        	var arc = d3.svg.arc()
		      .outerRadius(height / 15)
		      .startAngle(0)
		      .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });
			var brushg = svg.append("g")
				.attr("class", "brush")
				.call(brush);
			brushg.selectAll(".resize").append("path")
		        .attr("transform", "translate(0," +  height / 2 + ")")
		        .attr("d", arc);
		    brushg.selectAll("rect")
		        .attr("height", height);
		    var selectionArray = new Array();
		    var univArray = new Array();
		    function brushstart(p){
		    	selectionArray = new Array();
		    	univArray = new Array();
		    }
	        function brushmove(p) {
	    	    b = brush.extent();
	    	    var localBrushStart = (brush.empty()) ? 0 : Math.ceil(b[0]),
	    	        localBrushEnd = (brush.empty()) ? 0 : Math.ceil(b[1]);
	    	    d3.select("g.brush").call((brush.empty()) ? brush.clear() : brush.extent([b[0], b[1]]));
	    	    d3.selectAll("rect.subject-bar").each(function(d, i) {
	    	      var rectX = +d3.select(this).attr('x');
	    	      if(rectX >= localBrushStart && rectX < localBrushEnd){
	    	      	d3.select(this).classed('mouseover-highlight', true)
	    	      }else{
	    	      	d3.select(this).classed('mouseover-highlight', false);
	    	      }
	    	    });
	        }
	        function brushend(p) {
				var localBrushStart = (brush.empty()) ? 0 : Math.ceil(b[0]),
			      localBrushEnd = (brush.empty()) ? 0 : Math.floor(b[1]);
			    d3.selectAll("rect.subject-bar").each(function(d, i) {
			      var univAbbrName = universityDic[d.school_name];
			      var subjName = d.subjectName.split(' ')[0].replace('/','');
			      var rectX = +d3.select(this).attr('x');
			      var className = '.' + univAbbrName + '.' + subjName;
			      if(rectX > localBrushStart && rectX < localBrushEnd){
			      	d3.select(this).classed('mouseover-highlight', true);
			      	selectionArray.push(className);
			      	univArray.push(univAbbrName);
			      }else{
			      	d3.select(this).classed('mouseover-highlight', false)
			      }
			    });
			    univSubjHistogram.highlight_unique_rect_array(selectionArray);
			    universityMDS.highlight_univ_array(univArray);
	        }
		}
		function render_accord_subj(all_subj_array){
			var universityDic = dataCenter.universityDic;
			svg.selectAll('.x.axis').remove();
			var x = d3.scale.linear()
			    .range([0, width])
			    .domain([0, allSubjArray.length]);
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");
			svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);
			all_subj_array.sort(function(a,b){
				return b.subjectScore - a.subjectScore;
			});
			var subjectBar = svg.selectAll('.subject-bar')
				.data(all_subj_array);
			subjectBar.enter()
				.append('rect')
				.attr('class',function(d,i){
					var itemClass = d.subjectName.split(' ')[0].replace('/','');
					return 'subject-bar ' + universityDic[d.school_name] + ' ' + itemClass;
				})
				.attr('width', function(d,i){
					return x(1);
				})
				.attr('height', function(d,i){
					return height - y(d.subjectScore);
				})
				.attr('x', function(d,i){
					return x(i);
				})
				.attr('y', function(d,i){
					return y(d.subjectScore);
				});
			subjectBar.transition()
				.duration(1000)
				.attr('class', function(d,i){
					var itemClass = d.subjectName.split(' ')[0].replace('/','');
					return 'subject-bar ' + universityDic[d.school_name] + ' ' + itemClass;
				})
				.attr('width', function(d,i){
					return x(1);
				})
				.attr('height', function(d,i){
					return height - y(d.subjectScore);
				})
				.attr('x', function(d,i){
					return x(i);
				})
				.attr('y', function(d,i){
					return y(d.subjectScore);
				});
			subjectBar.exit().remove();
		}
		d3.selectAll("input").on("change", change);
		function change() {
			console.log(this.value);
		  if (this.value === "university"){
		  	render_accord_univ(allSubjArray);
		  }else{
		  	render_accord_subj(allSubjArray);
		  } 
		}
	},
	update: function(){
	},
	highlight_univ_rect: function(univ_name){
		var svg = d3.select("#g-subject-histogram");
		svg.selectAll('.' + univ_name)
			.classed('mouseover-highlight', true);
	},
	unhighlight_univ_rect: function(univ_name){
		var svg = d3.select("#g-subject-histogram");
		svg.selectAll('.' + univ_name)
			.classed('mouseover-highlight', false);
	},
	highlight_subject_rect: function(subject_name){
		var svg = d3.select("#g-subject-histogram");
		svg.selectAll('.' + subject_name)
			.classed('mouseover-highlight', true);
	},
	unhighlight_subject_rect: function(subject_name){
		var svg = d3.select("#g-subject-histogram");
		svg.selectAll('.' + subject_name)
			.classed('mouseover-highlight', false);
	},
	highlight_univ_subj_rect: function(univ_subj_name){
		var svg = d3.select("#g-subject-histogram");
		console.log(univ_subj_name);
		svg.select(univ_subj_name)
			.classed('mouseover-highlight', true);
	},
	unhighlight_univ_subj_rect: function(univ_subj_name){
		var svg = d3.select("#g-subject-histogram");
		svg.select(univ_subj_name)
			.classed('mouseover-highlight', false);
	}
}