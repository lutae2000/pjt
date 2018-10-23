function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}


function WellnessBarGraph( data ){      //---
	this.dataLen = 0;
	this.data = data;
	
	this.$buttons = $(".week li");
	this.$graphItems = $(".graph [data-day]");

	this.__init();
}

WellnessBarGraph.prototype.__init=function(){
	//$(".graph ul").height($(".bar_wrap").height());
	this.__bindEvent();
	this.__setBarGraph(this.data);
};


WellnessBarGraph.prototype.__bindEvent=function(){
	var me = this;
	
	this.$buttons.on("click", function(e){
		if(e.target.nodeName == "A"){
			e.preventDefault();
		}
		var index = me.$buttons.index(this);
		me.selectedDay(index);
	});

	var $graphBar = this.$graphItems.find("div");
	$graphBar.on("click", function(e){
		var index = $graphBar.index(this);
		me.selectedDay(index);
	})
};

WellnessBarGraph.prototype.selectedDay=function(index){
	if( index > this.dataLen-1){return;}
	this.$buttons.eq(index).addClass("on").siblings().removeClass("on");	
	var itemData = this.$graphItems.eq(index).data();
	this.$graphItems.eq(index).addClass("on").siblings().removeClass("on");
	
	var day = "";
	var day_key = "";

	if( itemData.day == this.data.today){
		day = "오늘 ";
	}/*else{
		day = getDayNameKor(day);
	}*/
	var day_key = itemData.day;
	console.log( 'itemData', itemData );

	$(".suc_txt .goal em").html(day+comma((itemData.goal)));
	$(".suc_txt .value em").html(comma((itemData.value)));
	
	// Custom Text Arc
	options.callback = myCallback;
	options.style.topC.stroke = '#02b7c0';
	options.txt.txt = '';
	
	//주간 걸음수 화면 
	$("#step_current").empty();
	//$("#step_current").html(comma((itemData.value)));
	//console.log(this.data.data[day_key]);
	$("#step_current").html(comma((this.data.data[day_key].value)));
	
	$("#step_goal").empty();
	$("#step_goal").html(" / "+comma((itemData.goal)));
	var step_per = 0;
		if (parseInt(itemData.goal) <= 0) {
			step_per = 0;
    	} else {
    		step_per = parseInt(this.data.data[day_key].value) / parseInt(itemData.goal) * 100;
    	}
		var step_val = Math.abs(Math.round(step_per));
		if (step_val > 100) step_val = 100;
		
	$("#step_percent").empty();
	$("#step_percent").html(step_val);
	
	if(step_val>=100){
		$('#step_status').removeClass('shortfall');
		$('#step_status').addClass('success');
		$("#step_status").html("목표달성"); 
	}else{
		$('#step_status').addClass('shortfall');
		$('#step_status').removeClass('success');
		if(step_val == 0){
			$("#step_status").html("데이터 없음");				
		}else{
			$("#step_status").html("목표미달");
		}
	}
	
	arcMeter( '#jogging_chart_step', leadingZeros(step_val), options );
	
	
	//주간 이동거리 화면 
	$("#distance_current").empty();
	
	$("#distance_goal").empty(); 
	$("#distance_goal").html(" / "+comma((itemData.goal)));
	
	//오늘자 데이터는 userData로부터 들고온다. 
	if(this.data.todayDateKey == day_key){
		this.data.data[day_key].value = this.data.userData[this.data.today];
		$("#distance_current").append(comma(this.data.userData[this.data.today]));
		
		var distance_per = 0;
		//주간 이동거리 목표 달성치 표시
		if (parseInt(itemData.goal) <= 0) {
			distance_per = 0;
		} else {
			distance_per = parseInt(this.data.userData[this.data.today]) / parseInt(itemData.goal) * 100;
		}

		var distance_val = Math.round(distance_per);
		if (distance_val > 100) distance_val = 100;
		
		$("#distance_percent").empty(); 
		$("#distance_percent").html(distance_val);
		
		if(distance_val>=100){
			$('#distance_status').removeClass('shortfall');
			$('#distance_status').addClass('success');
			$("#distance_status").html("목표달성"); 
		}else{
			$('#distance_status').addClass('shortfall');
			$('#distance_status').removeClass('success');
			if(distance_val == 0){
				$("#distance_status").html("데이터 없음");				
			}else{
				$("#distance_status").html("목표미달");
			}
		}
		arcMeter( '#jogging_chart_distance', leadingZeros(distance_val), options );
	}else{
		$("#distance_current").append(comma(this.data.data[day_key].value));
		
		var distance_per = 0;
		//주간 이동거리 목표 달성치 표시
		if (parseInt(itemData.goal) <= 0) {
			distance_per = 0;
		} else {
			distance_per = parseInt(this.data.data[day_key].value) / parseInt(itemData.goal) * 100;
		}

		var distance_val = Math.round(distance_per);
		if (distance_val > 100) distance_val = 100;
		
		$("#distance_percent").empty(); 
		$("#distance_percent").html(distance_val);
		
		if(distance_val>=100){
			$('#distance_status').removeClass('shortfall');
			$('#distance_status').addClass('success');
			$("#distance_status").html("목표달성"); 
		}else{
			$('#distance_status').addClass('shortfall');
			$('#distance_status').removeClass('success');
			if(distance_val == 0){
				$("#distance_status").html("데이터 없음");				
			}else{
				$("#distance_status").html("목표미달");
			}
		}
		arcMeter( '#jogging_chart_distance', leadingZeros(distance_val), options );
	}
	
	//주간 칼로리 소모 화면 
	$("#kcal_current").empty();
	
	$("#kcal_goal").empty(); 
	$("#kcal_goal").html(" / "+comma((itemData.goal)));
	
	if(this.data.todayDateKey == day_key){
		this.data.data[day_key].value = this.data.userData[this.data.today];
		
		$("#kcal_current").html(comma(this.data.userData[this.data.today]));
		
		var kcal_per = 0;
		if (parseInt(itemData.goal) <= 0) {
			kcal_per = 0;
		} else {
			kcal_per = parseInt(this.data.userData[this.data.today]) / parseInt(itemData.goal) * 100;
		}
		var kcal_val = Math.abs(Math.round(kcal_per));
		if (kcal_val > 100) kcal_val = 100;
		
		$("#kcal_percent").empty();
		
		if(kcal_val>=100){
				$('#kcal_status').removeClass('shortfall');
				$('#kcal_status').addClass('success');
				$("#kcal_status").html("목표달성"); 
			}else{
				$('#kcal_status').addClass('shortfall');
				$('#kcal_status').removeClass('success');
				if(kcal_val == 0){
					$("#kcal_status").html("데이터 없음");				
				}else{
					$("#kcal_status").html("목표미달");
				}
			}
			
		$("#kcal_percent").html(kcal_val);
		$("#percent_width").css('width',kcal_val+"%");
		arcMeter( '#jogging_chart_kcal', leadingZeros(kcal_val), options );
	}else{
		$("#kcal_current").html(comma(this.data.data[day_key].value));
		
		var kcal_per = 0;
		if (parseInt(itemData.goal) <= 0) {
			kcal_per = 0;
		} else {
			kcal_per = parseInt(this.data.data[day_key].value) / parseInt(itemData.goal) * 100;
		}
		var kcal_val = Math.abs(Math.round(kcal_per));
		if (kcal_val > 100) kcal_val = 100;
		
		$("#kcal_percent").empty();
		
		if(kcal_val>=100){
				$('#kcal_status').removeClass('shortfall');
				$('#kcal_status').addClass('success');
				$("#kcal_status").html("목표달성"); 
			}else{
				$('#kcal_status').addClass('shortfall');
				$('#kcal_status').removeClass('success');
				if(kcal_val == 0){
					$("#kcal_status").html("데이터 없음");				
				}else{
					$("#kcal_status").html("목표미달");
				}
			}
			
		$("#kcal_percent").html(kcal_val);
		$("#percent_width").css('width',kcal_val+"%");
		arcMeter( '#jogging_chart_kcal', leadingZeros(kcal_val), options );
	}
	
	if ( itemData.status == "OK") {
		$(".suc_txt div").addClass("on");
	}
	else{
		$(".suc_txt div").removeClass("on");
	}
};

WellnessBarGraph.prototype.__selectedDay=function(){
	var name = "";
	switch(day){
		case "mon":
			name = "월요일";
		break;
		case "tue":
			name = "화요일";
		break;
		case "wed":
			name = "수요일";
		break;
		case "thu":
			name = "목요일";
		break;
		case "fri":
			name = "금요일";
		break;
		case "sat":
			name = "토요일";
		break;
		case "sum":
			name = "일요일";
		break;
	}

	return name;
};

WellnessBarGraph.prototype.__setBarGraph=function(data){
	var pathname = $(location).attr('pathname');
	var maxValue = this.__getMinMaxData(data).max;
	
	if(maxValue%100 != 0){
		maxValue = (parseInt(maxValue/100)+1)*100;
	}

	//$(".vertical-txt01").html(comma(maxValue));
	
	var centerValue = 0;
	/*
	if( maxValue>200 && centerValue%100 != 0 ){
		centerValue = Math.round(data.goalData)/100;
	}
	*/

	centerValue = Math.round(data.goalData/200)*100;
	//$(".vertical-txt02").html(comma(centerValue)).css("bottom", "50%");
	
	$(".nline em").html(comma(data.goalData));
	/*
	$(".nline").css("bottom", this.__getPosition({
			max: halfValue,
			value: data.goalData
	})+"%");
	*/
	

	var lastDay;
	var count=400;
	var me = this;
	var total = 0;
	$.each(data.dateKeys, function(val, key){
	//$.each(data.data, function(key, val){
		var dateObj = new Date();
		var year = dateObj.getFullYear();
		var month = dateObj.getMonth()+1;
		var month1 = "";
		if( month < 10 ) {
			month1 = "0"+month;
		}else if( month >= 10) {
			month1 = month;
		}
		
		var day = dateObj.getDate();
		//var day1 = 28;
		
		var lastDay = ( new Date( year, month1, 0) ).getDate();
		
		console.log("lastDayis: "+lastDay);
		
		var lastToday = year + "-" + month1+ "-" + (lastDay<10 ? '0'+lastDay : lastDay);
		
		var today = year + "-" + month1+ "-" + (day<10 ? '0'+day : day);
		
		/*
		if(key == lastToday){
			var lastToday = year + "-" + month1+ "-" + (lastDay<10 ? '0'+lastDay : lastDay);
		}
		*/
		console.log(day);
		//console.log(data.data[key].dateKey);
		//var item_day_key = data.data[key].dateKey;
		
		//var getDay = year + month1+ (day<10 ? '0'+day : day);
		var getDay_value = ""+key;
		getDay_value = getDay_value.replace(/\-/g,'');
		console.log(getDay_value);
		
		var dataSet = new Array;
		var maxDataset = 0;
		var maxDatasetValue = 0;
		
		//주간 이동거리 
		if(key == today){
			getDay = year + "-" + month1+ "-" + (day<10 ? '0'+day : day);
			data.data[key].value = data.userData[data.today];
			console.log(data.data[key].value);
			/*
			var value = me.__getPosition({      
				max: maxValue,
				value: data.data[key].value
			});
			*/
			
			//하드코딩 된 부분 실제 데이터를 기반으로 테스트가 성공할때까지 남겨둠 
			/*
			if(key = "2018-03-26"){
				data.userData["mon"] = 150;
				data.data["2018-03-26"].value = data.userData["mon"];
			}
			if(key = "2018-03-27"){
				data.data["2018-03-27"].value = 100;
			}
			if(key = "2018-03-28"){
				data.data["2018-03-28"].value = 4840;
			}
			if(key = "2018-03-29"){
				data.data["2018-03-29"].value = 256;
			}
			if(key = "2018-03-30"){
				data.data["2018-03-30"].value = 3200;
			}
			if(key = "2018-03-31"){
				data.data["2018-03-31"].value = 6020;
			}
			if(key = "2018-04-01"){
				data.data["2018-04-01"].value = 600;
			}
			*/
			
			var getFirstDay = data.dateKeys;
			for(var i =0; i<=6; i++){
				dataSet[i]=data.data[getFirstDay[i]].value;
			}
			
			console.log(dataSet);
			
			maxDataset = Math.max.apply(null, dataSet);
			
			maxDatasetValue = (parseInt(maxDataset/210)+1);
			
				//목표치보다 크면 목표선 이상으로 하되 원래 값을 넣는다.
				if(data.data[key].value >= data.goalData){
					//칼로리 페이지에서만 작동 방식이 다르게끔 수정
					if(pathname == "/res/www/html/dashboard.burn.weekly.html"){
					var value = me.__getPosition({      
						max: maxDatasetValue,
						value: data.data[key].value/0.78
					});
					}else{
					var value = me.__getPosition({      
						max: maxDatasetValue,
						value: data.data[key].value/1.05
					});	
					}
				}else{
				//요일별 데이터가 목표수치보다 적을경우 목표선 이하에서만 머물도록 값을 넣는다.	
					if(pathname == "/res/www/html/dashboard.distance.weekly.html"){
						var value = me.__getPosition({      
							max: maxDatasetValue,
							value: data.data[key].value/80
						});
					}else if(pathname == "/res/www/html/dashboard.burn.weekly.html"){
						var value = me.__getPosition({      
							max: maxDatasetValue,
							value: data.data[key].value/6.5
						});
					}else{
						var value = me.__getPosition({      
						max: maxDatasetValue,
						value: data.data[key].value/120
					});
					}
				}
		}else{
			var getDay = year + month1+ (day<10 ? '0'+day : day);
			var getFirstDay = data.dateKeys;
			for(var i =0; i<=6; i++){
				if(key == getDay){
					//data.data[key].value = data.userData[data.today];
					//dataSet[i]=data.data[key].value;
				}else{
					dataSet[i]=data.data[getFirstDay[i]].value;
				}
			}
			
			maxDataset = Math.max.apply(null, dataSet);
			
			maxDatasetValue = (parseInt(maxDataset/100)+1);
			
			if(key == getDay_value){
				data.data[key] = 0;
			}else{
				//목표치보다 크면 목표선 이상으로 하되 원래 값을 넣는다.
				if(data.data[key].value >= data.goalData){
					//칼로리 페이지에서만 작동 방식이 다르게끔 수정
					if(pathname == "/res/www/html/dashboard.burn.weekly.html"){
					var value = me.__getPosition({      
						max: maxDatasetValue,
						value: data.data[key].value/0.78
					});
					}else{
					var value = me.__getPosition({      
						max: maxDatasetValue,
						value: data.data[key].value/1.05
					});	
					}
				}else{
				//요일별 데이터가 목표수치보다 적을경우 목표선 이하에서만 머물도록 값을 넣는다.	
					if(pathname == "/res/www/html/dashboard.distance.weekly.html"){
						var value = me.__getPosition({      
							max: maxDatasetValue,
							value: data.data[key].value/80
						});
					}else if(pathname == "/res/www/html/dashboard.burn.weekly.html"){
						var value = me.__getPosition({      
							max: maxDatasetValue,
							value: data.data[key].value/6.5
						});
					}else{
						var value = me.__getPosition({      
						max: maxDatasetValue,
						value: data.data[key].value/120
					});
					}
				}
			}
		}
	
	
		var itemData_week = data.data[key].weekKey;
		console.log(value);

		me.dataLen++;
		var $target = me.$graphItems.filter("[data-day="+itemData_week+"]");
		me.$buttons.filter("[data-day="+itemData_week+"]").removeClass("no-data");
		setTimeout(function(){
			if(parseInt(value)>=90){
				value = 90;
				$target.find("div").height(parseInt(value)+"%");
			}else{
				$target.find("div").height(parseInt(value)+"%");
			}
			
		}, count);
		count += 100;
		
		var itemData = data.data[key];
		
		if(parseInt(value)>=90){
			value = 90;
			$("#gr_Text_"+itemData_week).css("margin-top", 114-parseInt(value)*1.3+"px");
		}else{
			$("#gr_Text_"+itemData_week).css("margin-top", 114-parseInt(value)*1.3+"px");
		}
		//$("#gr_Text_"+key).html(comma(data.userData[key]));
		$("#gr_Text_"+itemData_week).html(comma(itemData.value));
		//result.userData[getDay].value
		$target.data({
			status: itemData.status,
			goal: itemData.goal,
			value: val,
			day: key
		});

		total += val;
		lastDay = key;
	});

	$(".gr_txt em").html(comma(Math.round(data.averageData)));

	this.selectedDay(this.$graphItems.index(this.$graphItems.filter("[data-day="+data.target+"]")));
};

WellnessBarGraph.prototype.__getMinMaxData=function(data){	
	var min = this.data.userData.mon;
	var max = Math.max(this.data.goalData+Math.ceil(this.data.goalData/10), 100);
	$.each(this.data.userData, function(key, val){
		if( min > val ){
			min = val;
		}
		if(max < val){
			max = val;
		}
	});

	return {min: min, max: max};
};

WellnessBarGraph.prototype.__getAverage=function(data){	
	var num=0;
	var index = 0;
	$.each(data.userData, function(){
		index++;
		num+=this;
	});

	return parseInt(num/index);
};
	
WellnessBarGraph.prototype.__getPosition=function(data){	
	var value = ( 100 - 0 ) / ( data.max - 0 ) * ( data.value - 0 ) + 0;
	return value;
};
