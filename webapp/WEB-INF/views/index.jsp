<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta name="keywords" content="" />
<meta name="description" content="" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width" />
<title>피트모아</title>
<link rel="stylesheet" href="${pageContext.request.contextPath }/assets/css/index.css" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/common.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/mcore.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/login.js"></script>
<script type="text/javaScript" language="javascript">
$(document).ready(function(){
	if($(window).height() > $("body").height()){
		$(".login_wrap").attr("style","height:"+$(window).height()+"px;");
	}
});

$( window ).resize(function() {
	if($(window).height() > $("body").height()){
		$(".login_wrap").attr("style","height:"+$(window).height()+"px;");
	}
});
</script>
<style>
.copyright{font-size:15px;color:#333333;height:50px;line-height:50px;float:left;background:none;text-align:center;width:100%}
.copyright .btn{font-size:15px;color:#333333;background:url('${pageContext.request.contextPath}/assets/images/login/bg_login_btn.png') left center no-repeat;background-size:6px;padding-left:14px; display:inline-block}

</style>
</head>
<body>
<div class="login_wrap">
	<div id="login">
		<div class="login_div">
			<img src="${pageContext.request.contextPath}/assets/images/login/login_logo.png" alt="FITMOA"  class="logo" />
			<div class="login_input">
				<input type="text" name="id" id="id" alt="로그인 아이디" placeholder="아이디를 입력하세요." />
				<input type="password" name="pw" id="pw" alt="로그인 아이디" />	        
				<button class="login" onclick="fn_show_layer('pop_notice_id');">로그인</button>
				<button class="login_facebook" onclick="fn_show_layer('pop_notice_id');">페이스북으로 로그인</button>
				<button class="login_kakao" onclick="fn_show_layer('pop_notice_id');">카카오톡으로 로그인</button>
				<button class="btn left"><span class="btn">회원가입</span></button>
				<button class="btn" onclick="fn_show_layer('pop_notice_pw');"><span class="btn">비밀번호찾기</span></button>
			</div>	    
		</div> 		
	</div>
	<!-- <p class="copyright">© 2009 <span>FITMOA.</span> All Rights Reserved.</p> -->
	<button class="copyright"><a href="${pageContext.request.contextPath}/main" class="btn">SKIP</a></button>
	
	
	<!-- 레이어 -->
	<div id="mask" class="hidden"></div>

	<!-- 알림 팝업 -->
	<div class="layer hidden" id="pop_notice_pw">
		<img src="./images/icon_pop_notice.png" alt="알림" class="pop_notice"/>
		<p>유효하지 않은 비밀번호입니다.</p>
		<div class="btn_div">
			<a href="javascript:fn_close_layer();" class="btn">확인</a> 
		</div>
	</div>

	<!-- 알림 팝업 -->
	<div class="layer hidden" id="pop_notice_id">
		<img src="./images/icon_pop_notice.png" alt="알림" class="pop_notice"/>
		<p>유효하지 않은 아이디입니다.</p>
		<div class="btn_div">
			<a href="javascript:fn_close_layer();" class="btn">확인</a> 
		</div>
	</div>


</div>
</body>
</html>
