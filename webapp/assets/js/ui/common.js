// Common UI Script
var isDialogShow = false;
var $currentPop, $popWrap;

//퍼블리싱 적용 2018-01-22
$(function(){


    //all
    $('.menu_wrap').fadeOut();
    $('.all').on('click',function(){
        setTimeout(function(){
            $('.menu_wrap').animate({
            left: 0
            },300);
        },50);
        $('.menu_wrap').fadeIn();
    });
    $('.menu_wrap .close').on('click',function(){
        $('.menu_wrap').animate({
        left: '100%'
        },300);
        $('.menu_wrap').fadeOut();
    });

    //main w_scroll
    $("#swipeMenu").length&&loaded();


     //레이어닫기
     $("#mask").click(function() {
        fn_close_layer();
    });

    
}); 


//select box
function fn_select(name){        
    var select = $("select#"+name);	    
	var select_name = select.children("option:selected").text();   
	$("select#"+name).siblings("#selectLabel_"+name).text(select_name);	
}

//go back page
function fn_goBack(){
    history.back(-2);
}


//wrap height
 $(document).ready(function(){    
    var wrapHeight = $(window).height() - $(".header").height();	
    if($(window).height() > $(".wrap").height()){
        $(".wrap").css("height", wrapHeight - 74);
    }
});


$( window ).resize(function() {
    var wrapHeight = $(window).height() - $(".header").height();		
    if($(window).height() > $(".wrap").height()){
        $(".wrap").css("height", wrapHeight - 74);
    }
});



function fn_show_layer(id){
    var maskHeight = $(document).height();
    var maskWidth = $(document).width(); 

    $('#mask').css({'width':maskWidth,'height':maskHeight});
    $('#mask').fadeTo("slow",0.7); 

    $('#'+id).fadeIn(1000);      
    $("#"+id).show();
    $('body').bind('touchmove', function(e){e.preventDefault()});

}

function fn_close_layer(){
    $('.layer').fadeOut(1000);  
    $('#mask').fadeOut(1000);    
    $('body').unbind('touchmove');
} 

//퍼블리싱 적용 2018-01-22

(function(window, undefined) {

'use strict';

var projectName = "Wellness";


$(document.body).ready(function(){

	var 
	$body = $("body"),
	$popupWrap = $(".pop_bg[data-pop-wrap]");

	$body.on("click", "[data-open-pop]", function(e){
		e.preventDefault();
		var id = $(this).attr("data-open-pop");
		if(id != undefined && id != ""){
			window[projectName].showLayerPopup(id);		
		}
	});

	$body.on("click", "[data-close-pop]", function(e){
		e.preventDefault();
		window[projectName].hideLayerPopup();
	});

	$body.on("click", "[data-tab-btn]", function(e){
		e.preventDefault();
		var $t = $(this).addClass("selectd");
		var id = $t.attr("data-tab-btn");
		$t.parent().siblings().find("a").removeClass("selectd");
		$("[data-tab-content="+id+"]").removeClass("dn").siblings().filter("[data-tab-content]").addClass("dn");
	});
	
	$popupWrap.on("click", ".ic_man", function(e){
		e.preventDefault();
		$(this).addClass("on");
		$(".pop_bg[data-pop-wrap] .ic_woman").removeClass("on");
	});

	$popupWrap.on("click", ".ic_woman", function(e){
		e.preventDefault();
		$(this).addClass("on");
		$(".pop_bg[data-pop-wrap] .ic_man").removeClass("on");
	});

	$popupWrap.on("click", "#pop_user_gender [data-close-pop]", function(e){
		e.preventDefault();
		var gender = "";
		var dateGender = "";
		if($(".pop_bg[data-pop-wrap] .ic_woman").hasClass("on")){
			gender = "여성";
			dateGender = "F";
		}else if( $(".pop_bg[data-pop-wrap] .ic_man").hasClass("on") ){
			gender = "남성";
			dateGender = "M";
		}

		$("span.user_gender").html(gender);
		$("input.user_gender").val(dateGender);
	});

    $(document.body).trigger("didLoad");
});



window[projectName] = {
	startSpinAnimation:function( $el, duration ){
		$el.data("isAnimate", true);
		duration = (duration==undefined) ? 1000 : duration;
		$el.stop().prop({"tempRotate":0}).animate({ "tempRotate":358}, { duration: duration, easing: "easeInOutQuad", 
            step: function(n){
               $el.css('transform', 'rotate('+n+'deg)');
            }, 
		    complete: function(){      
		    	if( $el.data("isAnimate") == true ){
		    		window.Wellness.startSpinAnimation($el);
		    	}
            }
        });	

	},

	stopSpinAnimation:function( $el ){
		$el.stop().data("isAnimate", false);
	},

	showLayerPopup: function(openID){
		if( $popWrap == undefined){
			$popWrap = $("[data-pop-wrap]");
		}
		isDialogShow = true;
		$popWrap.removeClass("dn");
		$currentPop = $("#"+openID).removeClass("dn");
		$currentPop.siblings().addClass("dn");

		if( $currentPop.find(".m-loadingspinner").length != 0 ){
			var $spin = $currentPop.find(".m-loadingspinner .m-draw2");
			window.Wellness.startSpinAnimation($spin);	
		}		
	},

	hideLayerPopup: function(){
		//isDialogShow = true;
		if( $popWrap == undefined){
			$popWrap = $("[data-pop-wrap]");
		}

		//if( $currentPop != undefined ){
			$popWrap.addClass("dn");
			$popWrap.find(".popup_wrap").addClass("dn");
			//$currentPop.addClass("dn");
		//}
			
		if( $currentPop && $currentPop.find(".m-loadingspinner").length != 0 ){
			var $spin = $currentPop.find(".m-loadingspinner .m-draw2");
			window.Wellness.stopSpinAnimation($spin);	
		}			
	},

	createDatepickerPopup:function($element){
		var defaultDate = new Date(1990, 6-1, 15);
		var datepicker = $element.mobiscroll().date({
            theme: 	$.mobiscroll.defaults.theme,
            mode: "scroller",
            display: "inline", 
            rows: 3,
            minDate: new Date(1910, 1-1, 1),
            maxDate: new Date(),
            defaultValue: defaultDate,
            monthNames: ["1월","2월","3월","4월","5월","6월", "7월","8월","9월","10월","11월","12월"],
            dateOrder: "yymd",
            height: 35
        });

        datepicker.mobiscroll('setVal', defaultDate);

        return datepicker;
	},

	getDatepickerVal:function(datepicker){
		var data = datepicker.mobiscroll('getVal');
		if(data == null){
			return null;
		}

        var year = data.getFullYear();
        var month = data.getMonth()+1;
 		var date = data.getDate();

        var fullDateKo = year+"년 "+month+"월 "+date+"일";
        if(month<10){
            month = "0"+month;
        }
       
        if(date<10){
            date = "0"+date;
        }


       return {year: year, month: month, date: date, fullDate: year+"-"+month+"-"+date, fullDateKo: fullDateKo};        
	},

	createTimepicker:function($element, defaultValue){ 	
		if( defaultValue == undefined){defaultValue = [0,0] }	
		var timepicker = $element.mobiscroll().scroller({
            theme: $.mobiscroll.defaults.theme     // Specify theme like: theme: 'ios' or omit setting to use default 
			//theme: "ios"
            ,mode: "scroller"       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
            ,display: "inline"
            ,height: 47
            ,minWidth:59
            ,circular:true
            ,wheels: [[
                {
                    keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    values: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23","00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23","00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
                },{
                    keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                    values: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]
                }
            ]]
            ,rows: 3                
        });
	
       $element.mobiscroll('setValue', defaultValue);
        return timepicker;
	},

	getTimepickerVal:function(timepicker){
		var data = timepicker.mobiscroll('getArrayVal');
		if(data == null){
			return null;
		}

       return data;   
	}
};

window[projectName].util = {
	comma:function(str) {
	    str = String(str);
	    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}
}

})(window);

// M-API Common
(function(window, undefined) {

'use strict';

var
controller = MainController.sharedInstance(),
popupController = PopupController.sharedInstance();

M.onReady(function(e) {
    var pathname = $(location).attr('pathname');
//    console.log(""+pathname);
  //  if(pathname = "/res/www/html/user.main.html"){
    	//M.data.removeParam("clear-stack");
  //  	controller.clearStack();
  //  }
    
	controller.initialize();

	if ( M.data.param("clear-stack") === "Y" ) {
		M.data.removeParam("clear-stack");
		controller.clearStack();
	}

	controller.bind("didFinishExecute", function( event ) {
		
        if ( event.action === "user.auth.start" ) {

            if ( event.error ) {
            	controller.execute( "move.login", {} );
            	return;
            }

            var result = event.result;
            
            if ( controller.userInfo().auth(result) ) {
                // 자동 로그인 후 회원 정보가 없으면, 프로필 설정화면 으로 진행
                if ( ! controller.userInfo().userName() ) {
                    //M.page.html("user.terms.html", {action:"NO_HISTORY"});
                    M.page.html("user.profile.trainEdit.html", {action:"NO_HISTORY"});
                }
                else if ( controller.deviceInfo().hasPairedBand() || controller.deviceInfo().skipBand() === "Y" ){
                    controller.execute( "move.home", {} );
                }
                else {
                	M.page.html("intro.pairing.html", {action:"NO_HISTORY", animation:"SLIDE_LEFT"});
                }
            }
            else {
                controller.sessionController().closeSession();
            
                //popupController.alert( M.locale.localizedString("message_login_error") );
                
                if (controller.sessionController().activedSession()) {
	            	controller.execute( "move.login", {} );
				}
            }
        }
        else if ( event.action === "user.auth" ) {
        	
        	if ( event.error ) {
            	controller.execute( "move.login", {} );
            	return;
            }

    		var result = event.result;

			if ( controller.userInfo().auth(result) ) {
                controller.sessionController().startSession();
			}
			else {
				controller.sessionController().closeSession();
            
                //popupController.alert( M.locale.localizedString("message_login_error") );

				if (controller.sessionController().activedSession()) {
	            	controller.execute( "move.login", {} );
				}
			}
    	}
        else if ( event.action === "user.logout" ) {
            //popupController.toast( "logout!!" );

            controller.reset();
            
            controller.fitManager().reset();
            controller.userInfo().logout();
            
            M.execute("wnRemoveLocalData");
            
        	controller.execute( "move.login", {} );
        }
	});

    controller.didAppear();
    	
	setTimeout( function() {
		$(document.body).trigger("didAppear");
	}, 0);
});

M.onBack(function(e) {
	console.log(M.info.stack().length);
	var pathname = $(location).attr('pathname');
	//  console.log(""+pathname);
	
	  if(pathname == "/res/www/html/user.signup.html" || pathname == "/res/www/html/user.password.once.html"){
	  	M.page.html("user.login.html");
	  }
     
	if ( M.info.stack().length < 2 ) {
		debug.log('###finish dialog###');
		debug.log('###finish dialog### isDialogShow? ', isDialogShow );
		// 2016.04.04  다이얼로그 중복팝업 수정
		// 현재 프로필 화면의 스택은 1이므로 해당 로직내에서 작동함
		// 첫번째는 종료하시겠습니까 로직을 타지않게 하는것이 중요함
		/**
		if(M.page.html("setting.device.html")){
			//isDialogShow = false;
			//window.Wellness.hideLayerPopup("pop_display");
			window.Wellness.hideLayerPopup("pop_time_display");
			window.Wellness.hideLayerPopup("pop_notmove");
			if(!window.Wellness.hideLayerPopup("pop_display")){
				isDialogShow = true;
			}
		}
		*/
		if (M.navigator.os("android")) {
		if(isDialogShow == false){
		isDialogShow = true;
			M.pop.alert({
	        	"title": "알림",
	            "message": "종료하시겠습니까?",
	            "buttons": ["취소", "종료"],
	            "onclick": function( buttonIndex ) {
	                if ( buttonIndex == 1 ) {
	                	
	                	//유라클에서 지원하는것중에 시스템 팝업창을 퍼블리싱 팝업창으로 바꾸는 조건 없을까?
	                	//페이스북 관련 로직은 로그캣을 켜서 확인 해본다.
	                   M.execute("wnStopApplication");
	                }
	                
	                isDialogShow = false;
	            }
			
	        });
		}
		else{
			window.Wellness.hideLayerPopup("pop_display");
			window.Wellness.hideLayerPopup("pop_time_display");
			window.Wellness.hideLayerPopup("pop_notmove");
			isDialogShow = false;
			//해당 부분에 백키누르면 팝업이 닫여지게 소스를 집어넣어야함
			//유라클에서 제공하는 API로 사용하기 때문에 바꿀 방법이 없음 (요청사항)
			//
		}
		}
	}
	else {
		if ( document.location.href.indexOf("mh_06_002.html") === -1 ) {
			controller.execute( "page.back" );
		}

		if(M.data.storage("UNPAIR_CLICK")=="true"){
			M.data.global("CANCEL_PAIRING","true");
		}
	}
	
	//해당 로직을 위에다가 주입시키고 테스팅 해볼것
	//일단은 SNS 연동 부분이 첫번째
});

M.page.prefer().blockMovePage = false;
M.page.prefer().shouldMovePage(function( api, url, param ) {
    if ( M.page.prefer().blockMovePage === true ) {
        return false;
    }
    
    M.page.prefer().blockMovePage = true;
});

M.onResume( function(e) {
    setTimeout(function() {
        $(document.body).trigger("applicationDidEnterForground");
    }, 0);
});

M.onPause( function(e) {
    setTimeout(function() {
        $(document.body).trigger("applicationDidEnterBackground");
    }, 0);
});

M.onRestore( function(e) {
    M.page.prefer().blockMovePage = false;

    controller.didAppear();
    
    setTimeout(function() {
        $(document.body).trigger("didAppear");
    }, 0);
});

M.onHide( function(e) {
   	controller.willDisappear();

    $(document.body).trigger("willDisappear", {});
});


})(window);
