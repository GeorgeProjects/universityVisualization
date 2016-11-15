var universitySmallMultiple = {
	initialize: function(){
		var self = this;
		var divWidth = $("#univ-small-multiple").width();
		var divHeight = $("#univ-small-multiple").height();
		var margin = {right: 40, left: 50, top: 30, bottom: 30},
			width = divWidth - margin.right - margin.left,
			height = divHeight - margin.top - margin.bottom;
		self.width = width;
		self.height = height;
		var svg = d3.select("#svg-univ-small-multiple")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("id", "g-univ-small-multiple")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		self.render();
	},
	render: function(){
		var scale = d3.scale.linear()
		  .domain([0, 100])
		  .range([0, 100])
		var univArray = new Array();
		d3.csv("datasets/Rank.csv", function(data){
			var formerName = "";
			for(var i = 0;i < data.length;i++){
				if(formerName != data[i]['School Name']){
					univArray[i] = new Object();
					var subjectName = data[i]['Subject Name'].replace(' ','_');
					//univArray[i][subjectName] =  
				}
			}
		});
		d3.csv("datasets/Rank.csv")
		  .row(function(d) {
		      d.Body = +d.Body;
		      d.Sweetness = +d.Sweetness;
		      d.Smoky = +d.Smoky;
		      d.Medicinal = +d.Medicinal;
		      d.Tobacco = +d.Tobacco;
		      d.Honey = +d.Honey;
		      d.Spicy = +d.Spicy;
		      d.Winey = +d.Winey;
		      d.Nutty = +d.Nutty;
		      d.Malty = +d.Malty;
		      d.Fruity = +d.Fruity;
		      d.Floral = +d.Floral;
		      return d;
		  })
		  .get(function(error, rows) {
		    var star = d3.starPlot()
		      .width(width)
		      .accessors([
		        function(d) { return scale(d.Body); },
		        function(d) { return scale(d.Sweetness); },
		        function(d) { return scale(d.Smoky); },
		        function(d) { return scale(d.Honey); },
		        function(d) { return scale(d.Spicy); },
		        function(d) { return scale(d.Nutty); },
		        function(d) { return scale(d.Malty); },
		        function(d) { return scale(d.Fruity); },
		        function(d) { return scale(d.Floral); },
		      ])
		      .labels([
		        'Body',
		        'Sweetness',
		        'Smoky',
		        'Honey',
		        'Spicy',
		        'Nutty',
		        'Malty',
		        'Fruity',
		        'Floral',
		      ])
		      .title(function(d) { return d.Distillery; })
		      .margin(margin)
		      .labelMargin(labelMargin)

		    rows.forEach(function(d, i) {
		      star.includeLabels(i % 4 === 0 ? true : false);

		      d3.select('#target').append('svg')
		        .attr('class', 'chart')
		        .attr('width', width + margin.left + margin.right)
		        .attr('height', width + margin.top + margin.bottom)
		        .append('g')
		        .datum(d)
		        .call(star)
		    });
		  });
	},
	highlight: function(){

	}
}