<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %> 

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="" />
<meta name="description" content="" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width" />
<title>Insert title here</title>
<link rel="stylesheet" href="${pageContext.request.contextPath }/assets/css/index.css" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/common.js"></script>
<script type="text/javaScript" language="javascript">

$(function(){

	$(".center_info_div dl dt a").click(function(){			
        if($(this).closest("dl").hasClass("close")){
            $(this).closest("dl").removeClass("close");	
            $(this).closest("dl").addClass("open");	
        }else{
            $(this).closest("dl").addClass("close");
            $(this).closest("dl").removeClass("open");	
        }
	});

}); 
</script>
<style>
.cont ul {display: flex; flex-wrap: wrap; padding: 10px;}
.cont ul li {width: 100%; margin-left: 1.96%;}
.cont ul li:nth-child(odd) {margin-left: 0}
.input-chk3 {display: inline-block; width: 100%}
.input-chk3 > input[type="radio"] {position: fixed; left: -999999px; width: 1px; height: 1px; opacity: 0;}
.input-chk3 > label {display: block; text-align: center; font-weight: 700; width: 100%; height: 40px; line-height: 40px; font-size: 15px; color: #000; border:1px solid #bababa}
.input-chk3 > input[type="radio"]:checked + label {color: #2b6bf8; border-color: #2b6bf8}

.cook_info{padding:18px;display: block;min-height:50px;position:relative;background:#fff;border-bottom:1px solid #f4f4f4}

.cook_list_info li{min-width:65px;font-size:15px;text-align: center;float:left}
.cook_list_info:after{display:block;content:'';clear:both;} 
.cook_list_info li{text-align: center}

.cook_info_tab li{background: url(./images/icon_mypage_menu04.png) center -3px no-repeat;width:33.3%;background-size: 50px;float:left;height:45px;line-height:45px;text-align:center;height: 60px;}
.cook_info_tab li a{color:#333;margin-top: 26px;font-size:16px;display:block;line-height:45px;font-weight:bold;}
</style>




<body>
<div class="header_wrap" id="top">
    <div class="header">
        <h1 class="logo"><a href="${pageContext.request.contextPath }/main"><img src="${pageContext.request.contextPath }/assets/images/logo.png" alt="피트모아"></a></h1>
        <span class="menu"><a href="javascript:fn_back();"><img src="${pageContext.request.contextPath }/assets/images/menu.png" alt="메뉴"></a></span>
        <span class="mypage"><a href="${pageContext.request.contextPath }/sub102"><img src="${pageContext.request.contextPath }/assets/images/mypage.png" alt="마이페이지"></a></span>
    </div>
</div>
<div class="wrap" >
    <h2 class="sub_title">
        레시피 상세보기
        <a href="javascript:fn_back();" class="btn_back">뒤로가기</a>
    </h2>
</div>
<div class="cook_info">
        <dd>
            <div class="map_div">
				<h1>${recipe.std_info_Vo.recipe_name} </h1>
				<img src="${recipe.std_info_Vo.img_url }" width="300">
			</div>
        </dd>
    </div>
	
<hr>


<table>
	<tr>
		<td><h3>요리재료 (${recipe.std_info_Vo.quantity }) 기준</h3></td>
	</tr>
	<tr>
		<td>
			<b>주재료 : </b>
			<c:forEach items="${recipe.mainIngreList}" var="vo">
				${vo.ingre_name}${vo.ingre_quantity },
			</c:forEach>
		</td>
	</tr>
	<c:if test="${fn:length(recipe.subIngreList) >0 }">
	<tr>
		<td>
			<b>부재료 : </b>
			<c:forEach items="${recipe.subIngreList}" var="bo">
				${bo.ingre_name}${bo.ingre_quantity },
			</c:forEach>

		</td>
	</tr>
	</c:if>
	<c:if test="${fn:length(recipe.sauceIngreList)>0}" > 
	<tr>
		<td>
		
			<b>양념 : </b>
			<c:forEach items="${recipe.sauceIngreList}" var="co">
				${co.ingre_name}${co.ingre_quantity },
			</c:forEach>
		</td>	
	</tr>
	</c:if>
</table>

<hr>

<h3>기본정보</h3>
<table>
	<tr>
		<td><b>조리시간: </b> ${recipe.std_info_Vo.cooking_time }</td>
	</tr>
	<tr>
		<td><b>열량: </b> ${recipe.std_info_Vo.kalo }</td>
	</tr>
	<tr>
		<td>
			<b>난이도:</b>
			<c:choose>
				<c:when test="${recipe.std_info_Vo.difficult eq '1' }"> 쉬움</c:when>
				<c:when test="${recipe.std_info_Vo.difficult eq '2' }"> 보통</c:when>
				<c:when test="${recipe.std_info_Vo.difficult eq '3' }"> 어려움</c:when>
			</c:choose>
		</td>
	</tr>
</table>	
	


<hr>

<h3>요리과정</h3>
<ol>
	<c:forEach items="${recipe.howtocookList }" var="htcl">
	<li>
		${htcl.how_to_cook }<img src="${htcl.how_to_cook_img }" width="200" align="middle" >
	</li>
	
	</c:forEach>
</ol>

<hr>


<h4>조리 팁</h4>

<c:forEach items="${recipe.howtocookList }" var="htc">
	<ul>
		<li>${htc.tip }</li>
	</ul>
	</c:forEach>

<%-- </c:if> --%>

<hr>

<h3>연관검색</h3>
<c:forEach items="${recipe.contentRecommend }" var="contentRecommend">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${contentRecommend.recipe_code}" >${contentRecommend.recipe_name}<img src="${contentRecommend.img_url }"width="200"></a>
</c:forEach>
</body>
</html>