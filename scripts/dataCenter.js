var dataCenter = {
	univOriginalDataSet: null,
	univDataSet: null,
	subjDataSet: null,
	subjDataSetObj: null,
	univDataSetObj: null,
	subjCount: 21,
	univCount: 20,
	universityDic: null,
	subjectDict: null,
	initialize: function(defer){
		var self = this;
		self.univ_dict_init();
		self.subj_dict_init();
		self.load(defer);
	},
	/**
	 * [初始化大学的全称到简称转换的字典]
	 * @return {[universityDict]} [大学的全称到教程的转换]
	 */
	univ_dict_init: function(){
		var self = this;
		var universityDic = new Object();
		universityDic['Peking University'] = 'PKU';
		universityDic['Tsinghua University'] = 'THU';
		universityDic['Fudan University'] = 'FDU';
		universityDic['University of Science and Technology of China'] = 'USTC';
		universityDic['Shanghai Jiao Tong University'] = 'SJTU';
		universityDic['Zhejiang University'] = 'ZJU';
		universityDic['Nanjing University'] = 'NJU';
		universityDic['Sun Yat-sen University'] = 'SYSU';
		universityDic['Beijing Normal University'] = 'BNU';
		universityDic['Huazhong University of Science and Technology'] = 'HUST';
		universityDic['Harbin Institute of Technology'] = 'HIT';
		universityDic['Xiamen University'] = 'XMU';
		universityDic['Nankai University'] = 'NKU';
		universityDic['Wuhan University'] = 'WHU';
		universityDic['Tongji University'] = 'TJU';
		universityDic['Xi\'an Jiaotong University'] = 'XJTU';
		universityDic['Shandong University'] = 'STU';
		universityDic['Southeast University'] = 'SEU';
		universityDic['South University of Technology'] = 'SCUT';
		universityDic['Dalian University of Technology'] = 'DUT';
		self.universityDic = universityDic;
	},
	/**
	 * [初始化专业到专业icon转换的字典]
	 * @return {[subjectDict]} [返回学科到icon的字典
	 */
	subj_dict_init: function(){
		var self = this;
		var subjectDict = new Object();
		subjectDict["Biology and BiochemistryScore"] = "icon-science";
		subjectDict["ChemistryScore"] = "icon-chemistry";
		subjectDict["Clinical MedicineScore"] = "icon-medicine";
		subjectDict["Computer ScienceScore"] = "icon-computer";
		subjectDict["Economics and BusinessScore"] = "icon-business";
		subjectDict["EngineeringScore"] = "icon-machineengineerno";
		subjectDict["Environment/EcologyScore"] = "icon-environment";
		subjectDict["GeosciencesScore"] = "icon-icon3";
		subjectDict["ImmunologyScore"] = "icon-medicine";
		subjectDict["Materials ScienceScore"] = "icon-medicine1";
		subjectDict["MathematicsScore"] = "icon-mathematics";
		subjectDict["MicrobiologyScore"] = "icon-biology";
		subjectDict["Molecular Biology and GeneticsScore"] = "icon-igenetics";
		subjectDict["Neuroscience and BehaviorScore"] = "icon-neural-network";
		subjectDict["Pharmacology and ToxicologyScore"] = "icon-jindu";
 		subjectDict["PhysicsScore"] = "icon-physics";
		subjectDict["Plant and Animal ScienceScore"] = "icon-dongzhiwu";
		subjectDict["Psychiatry/PsychologyScore"] = "icon-shenjingneike";
		subjectDict["Social Sciences and Public HealthScore"] = "icon-socialcontant-alt";
		subjectDict["Space ScienceScore"] = "icon-icon3";
		subjectDict["Agricultural SciencesScore"] = "icon-environment";
		self.subjectDict = subjectDict;
	},
	load: function(defer){
		var self = this;
		d3.csv("datasets/Rank.csv", function(data){
			self.univOriginalDataSet = data;
			var univObjArray = new Array();
			var univObjInterArray = new Array();
			var subjObjInterArray = new Array();
			var subjDataSetInterObj = new Object();
			for(var i = 0;i < data.length;i++){
				univObjArray[i] = new Object();
				for(attr in data[0]){
					var attrName = attr.replace(' ','');
					var testData = +data[i][attr];
					if(!isNaN(testData)){
						univObjArray[i][attrName] = +testData;
					}else{
						univObjArray[i][attrName] = data[i][attr];
					}
				}
			}
			var formerSchoolName = "";
			self.univDataSet = univObjInterArray;
			self.subjDataSet = subjObjInterArray;
			for(var i = 0;i < univObjArray.length;i++){
				if(univObjArray[i]["SchoolName"] != formerSchoolName){
					var univObj = new Object();
					univObj.school_name = univObjArray[i]["SchoolName"];
					univObj.global_ranking = +univObjArray[i]["GlobalRanking"];
					univObj.global_scores = +univObjArray[i]["GlobalScores"];
					univObjInterArray.push(univObj);
					var subjectName = univObjArray[i]["SubjectName"];
					var subjectRanking = univObjArray[i]["SubjectRanking"];
					var subjectScore = univObjArray[i]["SubjectScores"];
					var subjectNameScoreLabel = subjectName + 'Score';
					var subjectNameRankingLabel = subjectName + 'Rank';
					univObjInterArray[univObjInterArray.length - 1][subjectNameScoreLabel] = subjectScore;
					univObjInterArray[univObjInterArray.length - 1][subjectNameRankingLabel] = subjectRanking;
				}else{
					var subjectName = univObjArray[i]["SubjectName"];
					var subjectRanking = univObjArray[i]["SubjectRanking"];
					var subjectScore = univObjArray[i]["SubjectScores"];
					var subjectNameScoreLabel = subjectName + 'Score';
					var subjectNameRankingLabel = subjectName + 'Rank';
					univObjInterArray[univObjInterArray.length - 1][subjectNameRankingLabel] = subjectRanking;
					univObjInterArray[univObjInterArray.length - 1][subjectNameScoreLabel] = subjectScore;
				}
				formerSchoolName = data[i]["School Name"];
			}
			//subject Data set Intergrated Object指的是每一个学科作为对象的一个属性，并且每一个属性下的元素值为
			//一个数组，数组里面的元素是各个学校关于这个学科的得分对象
			self.subjDataSetObj = subjDataSetInterObj;
			var itemCount = 0;
			for(items in univObjInterArray[0]){
				subjObjInterArray[itemCount] = new Object();
				subjObjInterArray[itemCount].subject_name = items;
				subjDataSetInterObj[items] = new Array();
				for(var i = 0;i < univObjInterArray.length;i++){
					var schoolName = univObjInterArray[i].school_name;
					var schoolScore = univObjInterArray[i].global_scores;
					var itemValue = univObjInterArray[i][items];
					subjObjInterArray[itemCount][schoolName] = itemValue;
					var univSubjAttr = new Object();
					univSubjAttr['schoolName'] = schoolName;
					univSubjAttr['schoolScore'] = schoolScore;
					univSubjAttr[items] = itemValue;
					subjDataSetInterObj[items].push(univSubjAttr);
				}
				itemCount = itemCount + 1;
			}
			console.log('univObjInterArray',univObjInterArray);
			//university Data Set Intergrated Object应该是每一个学校作为对象的一个属性，属性下面的元素值是一个数组，
			//数组里面为这个学校的的各个学科的成绩值
			var univDatasetInterObj = new Object();
			self.univDataSetObj = univDatasetInterObj;
			var interCount = 0;
			for(var i = 0;i < univObjInterArray.length;i++){//
				var schoolName = univObjInterArray[i].school_name;
				univDatasetInterObj[schoolName] = new Array();
				var itemsCount = 0;
				for(items in univObjInterArray[0]){
					if((items.indexOf("Score") != -1) && (items.indexOf("Rank") == -1)){
						var itemValue = univObjInterArray[i][items];
						var schoolScore = univObjInterArray[i].global_scores;
						univDatasetInterObj[schoolName][itemsCount] = new Object();
						univDatasetInterObj[schoolName][itemsCount]['subjectName'] = items;
						univDatasetInterObj[schoolName][itemsCount]['subjectScore'] = itemValue;
						univDatasetInterObj[schoolName][itemsCount]['schoolScore'] = schoolScore;
						itemsCount++;
					}
				}
			}
			console.log(univDatasetInterObj);
			defer.resolve();
		});
	}
}