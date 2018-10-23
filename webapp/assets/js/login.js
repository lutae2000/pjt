
$(function(){
	var eventOp = "";
	 //리스트
	var pagingClick = "";
	var pagingStop = false;
	var navigatorNum = 0;
	var lastPageNum = 0;
	var dataInfoListresult = "N";
	var count = 0;
	var totalCount =  0;	//db에서 토탈카운트
	var navigatorNum = 0;
	var centerManager = [{}];
	var listHTML = "";
	var userName = "";	
	var x = "";
	var y = "";
	var searchAddr = "";
	var boardParam = M.data.param("boardParam");
  	var detailParam = M.data.param("detailParam");
  
	//레이어닫기
    $("#mask").click(function() {
    	fn_close();
    });
    
     $("#a_tab01").click(function() {
		$("#TAB_TYPE").val("tab01");
		$('#tab01').addClass("on");
       	$('#tab02').removeClass("on");
       	$('#tab01Con').css("display", "block"); 
       	$('#tab02Con').css("display", "none"); 
	});
	 $("#a_tab02").click(function() {
		$("#TAB_TYPE").val("tab02");
		$('#tab01').removeClass("on");
       	$('#tab02').addClass("on");
       	$('#tab01Con').css("display", "none"); 
       	$('#tab02Con').css("display", "block"); 
       	
	});
	
	
	$("#btn_back").click(function() {
		/*
		for(i=0;detailParam.BACK.href.length > i;i++){
			detailParam.BACK.onHref = detailParam.BACK.href[i];
		}
		*/
		M.page.html(detailParam.BACK_HREF, {action:"NO_HISTORY",param : 
		{
		'boardParam':{"TAB_TYPE":$("#TAB_TYPE_OG").val(),"PAGE":$("#page").val(),"PAGE_BLOCK":$("#pageBlock").val()},
		'detailParam':{"CENTER_SEQ_NO":detailParam.CENTER_SEQ_NO,"ACTION_TYPE":"","BACK_HREF":detailParam.BACK_HREF}
		}
		});
	});
     
    var 
    controller = MainController.sharedInstance(), 
    popupController = PopupController.sharedInstance(), 
    formController = new FormViewController( $("#board-form") );
	
	//공통화면 호출
	$(".header").load("inc/_header.html");
	$(".footer").load("inc/_footer.html");
	
	//팝업 -선택옵션 공통 펑션
	function fn_popConfirm_layer(type, eventText){
		type = "type4";
	    if (type == "type1") {
	    	confirmMgr.confirmText = "Band 에 연결 할 수 없습니다.\n다시 시도하시겠습니까";
	    	confirmMgr.confirmY = "다시 시도";
	    	confirmMgr.confirmN = "취소";
	    	confirmMgr.confirmType = "type1";
	    }
	    
	    if (type == "type2") {
	    	confirmMgr.confirmText = "단말기 모션 정보를 가져올 수 없습니다.\n다시 시도하시겠습니까";
	    	confirmMgr.confirmY = "다시 시도";
	    	confirmMgr.confirmN = "취소";
	    	confirmMgr.confirmType = "type1";
	    }
	    
	    if (type == "type3") {
	    	confirmMgr.confirmText = "데이타를 가져올 수 없습니다.\n다시 시도하시겠습니까";
	    	confirmMgr.confirmY = "다시 시도";
	    	confirmMgr.confirmN = "취소";
	    	confirmMgr.confirmType = "type3";
	    }
		if (type == "type4") {
	    	confirmMgr.confirmText = "디바이스 연결에 실패했습니다. \n 재연결을 시도하시겠습니까";
	    	confirmMgr.confirmY = "재연결";
	    	confirmMgr.confirmN = "취소";
	    	confirmMgr.confirmType = "type4";
	    }
		
		var maskHeight = $(document).height();
	    var maskWidth = $(document).width();
	    $('#mask').css({'width':maskWidth,'height':maskHeight});
	    $('#mask').fadeTo("slow",0.7);
	    
	    $('#confirmText1').empty();
	    $('#confirmText2').empty();
	   	$('#confirmText1').append(eventText);
	   	$('#confirmText2').append(confirmMgr.confirmText);
	   	$('#fn_close_confirmY').empty();
	   	$('#fn_close_confirmN').empty();
	   	$('#fn_close_confirmY').append(confirmMgr.confirmY);
	   	$('#fn_close_confirmN').append(confirmMgr.confirmN);
	   	
	   	$('#pop_confirm').fadeIn(1000);      
	    $("#pop_confirm").show();
	    $('body').bind('touchmove', function(e){e.preventDefault()});
	    $('html, body').css({'overflow': 'hidden'});
	   	
	   	$("#fn_close_confirmY").click(function() {
	   		confirmMgr.buttonIndex = "y";
	       	fn_confirmMgr();
	    }); 
	    
	    $("#fn_close_confirmN").click(function() {
	    	confirmMgr.buttonIndex = "n";
	    	fn_confirmMgr();
	    });
	}

	function fn_popText_layer_close(){
		$(".layer").fadeOut(1000);
		$('#mask').fadeOut(1000);
		$('html, body').css({'overflow': 'visible'});
		$('body').unbind('touchmove');
		return;
	}
	
	//팝업 -단일 텍스트. 공통 펑션
	function fn_popText_layer(text){
		var maskHeight = $(document).height();
		var maskWidth = $(document).width();
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		$('#mask').fadeTo("slow",0.7); 
		$('#popText').empty();
		$('#popText').append(text);
	   	$('#pop_text').fadeIn(1000);      
		$("#pop_text").show();
		$('body').bind('touchmove', function(e){e.preventDefault()});
		$('html, body').css({'overflow': 'hidden'});
	}
	$("#fn_close_layer5").click(function() {
		fn_popText_layer_close();
	});
	//레이어팝업 공용호출--//
	
	  controller.bind("didSuccessExecute", function( sender ) {
  		
  		if (sender.action === "center.login") {
  			//alert("1:"+JSON.stringify(sender.result.centerInfo));
  			//alert("2:"+JSON.stringify(sender.result.centerInfo.user_key));
  			if (sender.result.centerInfo == null) {
  				eventOp = "layer2";
  				fn_show_layer(eventOp);
  			} else {
  				regCenter(sender.result.centerInfo.user_key);
  			}
			
  		}
  				
		if ( sender.action === "center.mainList.center" ) {
			fn_show_layer(eventOp);
		}
		
	});

	controller.bind("didErrorExecute", function( sender ) {
		if ( sender.action === "center.login" ) {
			//popupController.toast( sender.error );
			fn_popText_layer(sender.error);
		}
		
        if ( sender.action === "center.mainList.center" ) {
			//popupController.toast( sender.error );
			fn_popText_layer(sender.error);
		}
	});
	
	function regCenter(auth){
		if (auth != "") {
			eventOp = "layer1";
			controller.execute("center.mainList.center", {
			"ACTION_TYPE":"reg",
			"CENTER_SEQ_NO" : detailParam.CENTER_SEQ_NO,
			"PAGE_BLOCK":"50",
			"PAGE":"1"
			});
		}
	}
	
	function paramInfoList(){
		if (boardParam != "" && boardParam != "''" && boardParam != undefined) {
			$("#TAB_TYPE").val(boardParam.TAB_TYPE);
		  	$("#pageBlock").val(boardParam.PAGE_BLOCK);
		  	$("#page").val(boardParam.PAGE);
		  	M.data.param("boardParam","");
		  	
    		
    		$("#centerAuthChk").click(function() {
		  		if ($("#TAB_TYPE").val() == "tab01") {
		  			userName = $("userName1").val();
		  		} else {
		  			userName = $("userName2").val();
		  		}
				controller.execute("center.login", {
					"ACTION_TYPE" : "auth",
					"CENTER_SEQ_NO" : detailParam.CENTER_SEQ_NO,
					"USER_NAME" : userName,
		    		"USER_PHONE" : $("#userMobile").val(),
					"CARD_NO" : $("#userCard").val()
				});
    		});
		  	
		}
	}
	paramInfoList();
	
 });   