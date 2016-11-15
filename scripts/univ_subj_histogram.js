var univSubjHistogram = {
	width: 0,
	height: 0,
	iconRadius: 0,
	initialize: function(){
		var self = this;
		var divWidth = 708;
		var divHeight = 623;
		console.log('divWidth:' + divWidth + 'divHeight:' + divHeight);
		var margin = {right: 10, left: 10, top: 5, bottom: 20},
			width = divWidth - margin.right - margin.left,
			height = divHeight - margin.top - margin.bottom;
		self.width = width;
		self.height = height;
		var svg = d3.select("#svg-univ-subj-histogram")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("id", "g-univ-subj-histogram")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		self.render();
		self.add_button_mouseover_event();
		self.add_button_mouseout_event();
	},
	render: function(){
		var self = this;
		var univDict = dataCenter.universityDic;
		var svg = d3.select('#g-univ-subj-histogram');
		var univData = dataCenter.univDataSet;
		/**
		 * [subjObjData description]
		 * @type {[object of array, and each attribute is an array]}
		 *  - Agricultural SciencesScore
		 *  - Biology and BiochemistryScore
		 *  - .......
		 *  - global_score
		 *  - global_rank
		 */
		var subjObjData = dataCenter.subjDataSetObj;
		console.log('subjObjData',subjObjData);
		/**
		 * [univObjData description]
		 * @type {[object of array, and each attrbibute is an array]}
		 * - Beijing Normal University
		 * - ....
		 * - Peking University
		 */
		var univObjData = dataCenter.univDataSetObj;
		console.log('univObjData',univObjData);
		//render_accord_subj(univData, subjObjData);
		render_accord_univ(univObjData);
		function render_accord_univ(univ_obj_data){
			var widthRadius = self.width/dataCenter.subjCount;
			var heightRadius = self.height/dataCenter.univCount;
			var bothWidthHeightRadius = widthRadius>heightRadius?heightRadius:widthRadius;
			self.iconRadius = bothWidthHeightRadius;
			var xScale = d3.scale.linear()
				.range([0, bothWidthHeightRadius * 3 / 4])
				.domain([0,100]);
			var yScale = d3.scale.linear()
				.range([0, bothWidthHeightRadius * 3 / 4])
				.domain([0,100]);
			var itemCount = 0;
			var universityNameArray = new Array();
			var univDataArray = null;
			var universityDic = dataCenter.universityDic;
			for(items in univ_obj_data){
				universityNameArray.push(universityDic[items]);
				var svg_g = svg.append('g')
				.attr('id', items);
				univDataArray = univ_obj_data[items];
				/**
				 * [univDataArray]
				 * @type {[type]} Object
				 *   - schoolScore
				 *   - school_name
				 *   - subjectName
				 *   - subjectScore
				 */
				var univRect = svg_g.selectAll('.rect')
				.data(univDataArray);
				univRect.enter()
				.append('rect')
				.attr('class', function(d,i){
					return univDict[items] + ' ' + d.subjectName.split(' ')[0];
				})
				.attr('x', function(d,i){
					return bothWidthHeightRadius * i;
				})
				.attr('y', function(d,i){
					return bothWidthHeightRadius * itemCount;
				})
				.attr('width', function(d,i){
					if(typeof d.subjectScore === 'undefined'){
						return 0;
					}
					return xScale(d.subjectScore);
				})
				.attr('height', function(d,i){
					return yScale(d.schoolScore);
				})
				.on('mouseover', function(d,i){
					d3.select(this)
						.classed('mouseover-highlight', true);
					var univName = univDict[d.school_name];
					var subjName = d.subjectName.split(' ')[0].replace('/','');
					var univSubjName = '.' + univName + '.' + subjName;
					subjHistogram.highlight_univ_subj_rect(univSubjName);
				})
				.on('mouseout', function(d,i){
					d3.select(this)
						.classed('mouseover-highlight', false);
					var univName = univDict[d.school_name];
					var subjName = d.subjectName.split(' ')[0].replace('/','');
					var univSubjName = '.' + univName + '.' + subjName;
					subjHistogram.unhighlight_univ_subj_rect(univSubjName);
				});
				itemCount = itemCount + 1;
			}
			var subjectArray = new Array();
			for(var i = 0;i < univDataArray.length;i++){
				subjectArray.push(univDataArray[i].subjectName);
			}
			add_univ_span(universityNameArray);
			add_subj_span(subjectArray);
		}
		function render_accord_subj(univ_data, subj_obj_data){
			var widthRadius = self.width/dataCenter.subjCount;
			var heightRadius = self.height/dataCenter.univCount;
			var bothWidthHeightRadius = widthRadius>heightRadius?heightRadius:widthRadius;
			self.iconRadius = bothWidthHeightRadius;
			var xScale = d3.scale.linear()
				.range([0, bothWidthHeightRadius * 3 / 4])
				.domain([0,100]);
			var yScale = d3.scale.linear()
				.range([0, bothWidthHeightRadius * 3 / 4])
				.domain([0,100]);
			var itemCount = 0;
			var subjectArray = new Array();
			var subjectNameArray = new Array();
			var subjDataArray = null
			for(items in univ_data[0]){
				if((items.indexOf("Score") != -1) && (items.indexOf("Rank") == -1)){
					/*subjectDataArray
					* array[object(university)]
					* object(university){Math(subject)Score,schoolScore,schoolName("Peking University")}
					*/
					var itemValue = items.replace(' ','').replace('/','');
					subjectNameArray.push(items);
					subjDataArray = subj_obj_data[items];
					subjectArray.push(items);
					var selectItem = svg.selectAll('#' + itemValue)
					.data([itemValue]);
					/**
					 * [function description 这个地方加上transition就不正确]
					 * @type {[type]}
					 */
					var svg_g = selectItem.enter().append("g")//
						.attr("id", function(d,i){
							return itemValue;
						})
						.attr("transform", "translate(" + (bothWidthHeightRadius * itemCount) + "," + 0 + ")");
					selectItem
						.transition()
	      				.duration(750)
						.attr("transform", "translate(" + (bothWidthHeightRadius * itemCount) + "," + 0 + ")");
					var univRect = svg_g.selectAll('rect')
					.data(subjDataArray)
					.enter()
					.append('rect')
					.attr('y', function(d,i){
						return bothWidthHeightRadius * i;
					})
					.attr('width', function(d,i){
						if(typeof d[items] === 'undefined'){
							return 0;
						}
						return xScale(d[items]);
					})
					.attr('height', function(d,i){
						return yScale(d.schoolScore);
					})
					.on('mouseover', function(d,i){
						d3.select(this)
							.classed('mouseover-highlight', true);
					})
					.on('mouseout', function(d,i){
						d3.select(this)
							.classed('mouseover-highlight', false);
					});
					itemCount = itemCount + 1;
				}
			}
			var universityNameArray = new Array();
			var universityDic = dataCenter.universityDic;
			//获得内部是大学名称的的数组
			for(var i = 0;i < subjDataArray.length;i++){
				var univName = subjDataArray[i].schoolName;
				universityNameArray.push(universityDic[univName]);
			}
			add_univ_span(universityNameArray);
			add_subj_span(subjectArray);
		}
		/**
		 * [在纵排的University中代表大学的按钮]
		 * @param univ_array [大学数组，按照数组中的顺序向div中添加代表大学的span]
		 */
		function add_univ_span(univ_array){
			$("#div-univ-histogram-icon").html(null);
			for(var i = 0;i < univ_array.length;i++){
				$("#div-univ-histogram-icon")
					.append('<div id = "' + univ_array[i] + '" class = "univ-label"><span class="btn btn-default btn-xs univ-span">' + univ_array[i] + '</span></div>');			
			}
		}
		/**
		 * [在横排的代表subject的div中添加学科的按钮]
		 * @param {[Array]} subj_array [学科数组，按照数组中的顺序向div中添加代表学科的span]
		 */
		function add_subj_span(subj_array){
			$("#div-subj-histogram-icon").html(null);
			var subjDict = dataCenter.subjectDict;
			for(var i = 0;i < subj_array.length;i++){
				var subjName = subj_array[i];
				var fontSize = Math.round(self.iconRadius / 2);
				console.log('iconRadius', self.iconRadius);
				$("#div-subj-histogram-icon")
					.append("<span class = \"subject-icon-span\" id = \""+ subjName +"\"><span class=\"btn btn-default btn-xs\">  <i class=\"icon iconfont " + subjDict[subjName] + "\" style = \"font-size:" + fontSize + "px\"></i></span><span>");			
			}
		}
		function addIcon(){

		}
	},
	add_button_mouseover_event: function(){
		var self = this;
		$('.subject-icon-span').mouseover(function(d){
			/**
			 * subject class
			 */
			var subjName = d3.select(this).attr('id').replace('/','').split(' ')[0];
			self.highlight_subject_rect(subjName);
			subjHistogram.highlight_subject_rect(subjName);
		});
		$('.univ-label').mouseover(function(d){
			/**
			 * univ class
			 */
			var univName = d3.select(this).attr('id');
			self.highlight_subject_rect(univName);
			universityMDS.highlight_univ(univName);
			subjHistogram.highlight_univ_rect(univName);
		});
	},
	add_button_mouseout_event: function(){
		var self = this;
		$('.subject-icon-span').mouseout(function(d){
			var subjectName = d3.select(this).attr('id').replace('/','').split(' ')[0];
			self.unhighlight_subject_rect(subjectName);
			subjHistogram.unhighlight_subject_rect(subjectName);
		});
		$('.univ-label').mouseout(function(d){
			var univName = d3.select(this).attr('id');
			self.unhighlight_subject_rect(univName);
			universityMDS.unhighlight_univ(univName);
			subjHistogram.unhighlight_univ_rect(univName);
		});
	},
	add_button_click_event: function(){
		$('.subject-icon-span').click(function(d){
			var subjectAllName = d3.select(this).attr('id');
			var subjectAbbrName = d3.select(this).attr('id').replace('/','').split(' ')[0];
			univObjData.sort(function(a,b){

			});
		});
		$('.univ-label').click(function(d){

		});
		function find_specific_attr(subject_name){

		}
	},
	highlight_subject_rect: function(subj_name){
		var svg = d3.select('#g-univ-subj-histogram');
		svg.selectAll('.' + subj_name).classed('mouseover-highlight', true);
	},	
	unhighlight_subject_rect: function(subj_name){
		var svg = d3.select('#g-univ-subj-histogram');
		svg.selectAll('.' + subj_name).classed('mouseover-highlight', false);
	},
	highlight_univ_rect: function(univ_name){
		var svg = d3.select('#g-univ-subj-histogram');
		svg.selectAll('.' + univ_name).classed('mouseover-highlight', true);
	},
	unhighlight_univ_rect: function(univ_name){
		var svg = d3.select('#g-univ-subj-histogram');
		svg.selectAll('.' + univ_name).classed('mouseover-highlight', false);
	},
	highlight_unique_rect: function(univ_subj_name){
		var svg = d3.select('#g-univ-subj-histogram');
	},
	highlight_unique_rect_array: function(univ_rect_array_name){
		var svg = d3.select('#g-univ-subj-histogram');
		svg.selectAll('rect').classed('mouseover-highlight', false);
		for(var i = 0;i < univ_rect_array_name.length;i++){
			svg.select(univ_rect_array_name[i]).classed('mouseover-highlight', true);
		}
	},
	unhighlight_unique_rect: function(univ_subj_name){
		var svg = d3.select('#g-univ-subj-histogram');
		svg.selectAll('rect').classed('mouseover-highlight', false);
	}
}