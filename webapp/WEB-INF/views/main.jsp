<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="" />
<meta name="description" content="" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width" />
<title>피트모아</title>
<link rel="stylesheet" href="${pageContext.request.contextPath }/assets/css/index.css" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/common.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/mcore.min.js"></script>
<!-- <script type="text/javascript" src="./js/login.js"></script> -->
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
	

@keyframes sheen {
  0% {
    transform: skewY(-45deg) translateX(0);
  }
  100% {
    transform: skewY(-45deg) translateX(12.5em);
  }
}
.wrapper {
  display: contents;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.button {
  font-weight:700;
  padding: 0.75em 2em;
  text-align: -webkit-center;
  text-decoration: none;
  color: #2194e0;
  border: 2px solid #2194e0;
  font-size: 28px;
  display: -webkit-box;
  border-radius: 0.3em;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}
.button:before {
  content: "";
  background-color: rgba(255, 255, 255, 0.5);
  height: 100%;
  width: 3em;
  display: block;
  position: absolute;
  top: 0;
  left: -4.5em;
  transform: skewX(-45deg) translateX(0);
  transition: none;
}
.button:hover {
  background-color: #2194e0;
  color: #fff;
  border-bottom: 4px solid #1977b5;
}
.button:hover:before {
  transform: skewX(-45deg) translateX(13.5em);
  transition: all 0.5s ease-in-out;
}

</style>
</head>
<body>
<div class="main_wrap">
	<div id="main">
		<div class="wrap_div">
			<img src="${pageContext.request.contextPath }/assets/images/login/login_logo.png" alt="FITMOA"  class="logo" />
			<div class="main_input">
				<div class="wrapper">
					<a href="${pageContext.request.contextPath}/list/search" class="button" style="background:url('${pageContext.request.contextPath}/images/recipe_img.jpeg') center no-repeat;background-size:100%;">레시피 검색</a>
				</div>
				<div class="wrapper">
					<a href="${pageContext.request.contextPath}/selectIngre" class="button" style="background:url('${pageContext.request.contextPath}/images/recipe_ingredient.jpeg') center no-repeat;background-size:100%;">재료로 추천 받기</a>
				</div>
				<div class="wrapper">
					<a href="${pageContext.request.contextPath}/recommend" class="button" style="background:url('${pageContext.request.contextPath}/images/today_cook.jpeg') center no-repeat;background-size:100%;">오늘의 요리 추천</a>
				</div>
				<div class="wrapper">
					<a href="${pageContext.request.contextPath}/about_info.html" class="button" style="background:url('${pageContext.request.contextPath}/images/macbookimg.jpeg') center no-repeat;background-size:100%;">About Info</a>
				</div>
				
			</div>	
			    
		</div> 		
		<p class="copyrightcook">© 2018 <span>JJHCOOK.</span> All Rights Reserved.</p>
	</div>
	
	
	<!-- 레이어 -->
	<div id="mask" class="hidden"></div>

	<!-- 알림 팝업 -->
	<div class="layer hidden" id="pop_notice_pw">
		<img src="${pageContext.request.contextPath}/images/icon_pop_notice.png" alt="알림" class="pop_notice"/>
		<p>유효하지 않은 비밀번호입니다.</p>
		<div class="btn_div">
			<a href="javascript:fn_close_layer();" class="btn">확인</a> 
		</div>
	</div>

	<!-- 알림 팝업 -->
	<div class="layer hidden" id="pop_notice_id">
		<img src="${pageContext.request.contextPath}/images/icon_pop_notice.png" alt="알림" class="pop_notice"/>
		<p>유효하지 않은 아이디입니다.</p>
		<div class="btn_div">
			<a href="javascript:fn_close_layer();" class="btn">확인</a> 
		</div>
	</div>


</div>
</body>
</html>
