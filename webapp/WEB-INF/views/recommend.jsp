<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="${pageContext.request.contextPath }/assets/css/index.css" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/libs/jquery/jquery.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/libs/jquery/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/libs/instance/instance.ui.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/ui/view.js"></script>
<script type="text/javaScript" language="javascript">

</script>
<style>
.tabCon_kor_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e6e9f9, #b6bcf4);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out; margin-bottom: 20px;}
.tabCon_Chn_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #f3e6f9, #d9b6f4);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out; margin-bottom: 20px;}
.tabCon_Jpn_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e3fffc, #b5eae8);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out; margin-bottom: 20px;}
.tabCon_East_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, rgb(246, 249, 230), #f4f0b6);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out; margin-bottom: 20px;}
.tabCon_Fus_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #f9e6e8, #f4b6be);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out; margin-bottom: 20px;}
.tabCon_West_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e6f8f9, #b6ebf4);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out; margin-bottom: 20px;}
.tabCon_Ital_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e6f9ee, #b6f4dc);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}

.tabCon_kor_table_sub {padding-left: 10px; color: #fff; background:#4c73c6; font-size:17pt; font-weight: 700; border-bottom: 1px solid #dfdfdf;}

.tabCon_kor_list_mypage_menu{margin: 15px;/* border-top: 1px solid #e9e9e9; */background:#fff;}
.tabCon_kor_table_img{width: 100%;/* max-width:200px; */max-height: 250px;}
.tabCon_kor_list_mypage_menu li:nth-child(2n){/* border-right:1px solid #e9e9e9 */}
.tabCon_kor_list_mypage_menu:after{display:block;content:'';clear:both;}

.tabCon_kor_table_menu{/* display: block; */width: 100%;max-height: 230px;/* margin-top: 96px; */box-shadow: border-box;/* font-size: 25px; *//* font-weight: 800; */background: black;/* color: #fff; *//* opacity: 0.6; */height: 20%;/* width:200px; */text-align: center;}

.tabCon_list_Name{display: block;/* margin-top: 96px; */box-shadow: border-box;font-size: 25px;font-weight: 800;background: black;color: #fff;opacity: 0.6;height: 20%;/* width:200px; */text-align: center;}

</style>
</head>
<body>


<div id="tabCon_kor">
<p class="tabCon_kor_title">한식 추천 메뉴</p>
<div class="tabCon_kor_list">
	<ul class="tabCon_kor_list_mypage_menu">
		<c:forEach items="${recommendRecipe.recommendKorList}" var="recommendKorList">
		<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendKorList.recipe_code }" > 
			<img src="${recommendKorList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendKorList.recipe_name }
			</div></a>
		
		</c:forEach>
	</ul>
</div>
<p class="tabCon_kor_title">조회 랭킹</p>
	<c:forEach items="${recommendRecipe.korRankingList }" var="korRankingList">
		<td><li type="1" class="tabCon_kor_table_sub"href="${pageContext.request.contextPath}/readContent?recipe_code=${korRankingList.recipe_code}">${korRankingList.recipe_name }</li>
		
	</c:forEach>

<hr>
</div>

<!-- 중식부분 -->
<div id="tabCon_kor">
	<p class="tabCon_Chn_title">중식 추천 메뉴</p>
	<div class="tabCon_kor_list">
		<ul class="tabCon_kor_list_mypage_menu">
			<c:forEach items="${recommendRecipe.recommendChnList}" var="recommendChnList">
			<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendChnList.recipe_code }"> 
				
			<img src="${recommendChnList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendChnList.recipe_name }
			</div></a>
			</c:forEach>
		</ul>
	</div>
	<p class="tabCon_Chn_title">조회 랭킹</p>
		<c:forEach items="${recommendRecipe.chnRankingList }" var="chnRankingList">
			<li type="1" class="tabCon_kor_table_sub" href="${pageContext.request.contextPath}/readContent?recipe_code=${chnRankingList.recipe_code}">${chnRankingList.recipe_name }</li>
			
		</c:forEach>
	
	<hr>
</div>

<!-- 일식부분 -->
<div id="tabCon_kor">
	<p class="tabCon_Jpn_title">일식 추천 메뉴</p>
	<div class="tabCon_kor_list">
		<ul class="tabCon_kor_list_mypage_menu">
			<c:forEach items="${recommendRecipe.recommendJpnList}" var="recommendJpnList">
			<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendJpnList.recipe_code }"> 
			
			<img src="${recommendJpnList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendJpnList.recipe_name }
			</div></a>
			</c:forEach>
		</ul>
	</div>
	<p class="tabCon_Jpn_title">조회 랭킹</p>
		<c:forEach items="${recommendRecipe.jpnRankingList }" var="jpnRankingList">
			<li type="1" class="tabCon_kor_table_sub"href="${pageContext.request.contextPath}/readContent?recipe_code=${jpnRankingList.recipe_code}">${jpnRankingList.recipe_name }</li>
			
		</c:forEach>
	
	<hr>
</div>

<!-- 동양식부분 -->
<div id="tabCon_kor">
	<p class="tabCon_East_title">동양식 추천 메뉴</p>
	<div class="tabCon_kor_list">
		<ul class="tabCon_kor_list_mypage_menu">
			<c:forEach items="${recommendRecipe.recommendEastList}" var="recommendEastList">
			<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendEastList.recipe_code }"> 
			
			<img src="${recommendEastList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendEastList.recipe_name }
			</div></a>
			</c:forEach>
		</ul>
	</div>
	<p class="tabCon_East_title">조회 랭킹</p>
		<c:forEach items="${recommendRecipe.recommendEastList }" var="recommendEastList">
			<li type="1" class="tabCon_kor_table_sub"href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendEastList.recipe_code}">${recommendEastList.recipe_name }</li>
			
		</c:forEach>
	
	<hr>
</div>

<!-- 퓨전부분 -->
<div id="tabCon_kor">
	<p class="tabCon_Fus_title">퓨전 추천 메뉴</p>
	<div class="tabCon_kor_list">
		<ul class="tabCon_kor_list_mypage_menu">
			<c:forEach items="${recommendRecipe.recommendFusList}" var="recommendFusList">
			<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendFusList.recipe_code }">
			
			<img src="${recommendFusList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendFusList.recipe_name }
			</div></a>
			</c:forEach>
		</ul>
	</div>
	<p class="tabCon_Fus_title">조회 랭킹</p>
		<c:forEach items="${recommendRecipe.fusRankingList }" var="fusRankingList">
			<li type="1" class="tabCon_kor_table_sub"href="${pageContext.request.contextPath}/readContent?recipe_code=${fusRankingList.recipe_code}">${fusRankingList.recipe_name }</li>
			
		</c:forEach>
	
	<hr>
</div>

<!-- 서양식부분 -->
<div id="tabCon_kor">
	<p class="tabCon_West_title">서양식 추천 메뉴</p>
	<div class="tabCon_kor_list">
		<ul class="tabCon_kor_list_mypage_menu">
			<c:forEach items="${recommendRecipe.recommendWestList}" var="recommendWestList">
			<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendWestList.recipe_code }"> 
			
			<img src="${recommendWestList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendWestList.recipe_name }
			</div></a>
			</c:forEach>
		</ul>
	</div>
	<p class="tabCon_West_title">조회 랭킹</p>
		<c:forEach items="${recommendRecipe.westRankingList }" var="westRankingList">
			<li type="1" class="tabCon_kor_table_sub"href="${pageContext.request.contextPath}/readContent?recipe_code=${westRankingList.recipe_code}">${westRankingList.recipe_name }</li>
			
		</c:forEach>
	
	<hr>
</div>


<!-- 이탈리아식 부분 -->
<div id="tabCon_kor">
	<p class="tabCon_Ital_title">이탈리아식 추천 메뉴</p>
	<div class="tabCon_kor_list">
		<ul class="tabCon_kor_list_mypage_menu">
			<c:forEach items="${recommendRecipe.recommendItalList}" var="recommendItalList">
			<a class="tabCon_kor_table_img" href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendItalList.recipe_code }"> 
			
			<img src="${recommendItalList.img_url }" class="tabCon_kor_table_menu">
			<div class="tabCon_list_Name">
					${recommendItalList.recipe_name }
			</div></a>
			</c:forEach>
		</ul>
	</div>
	<p class="tabCon_Ital_title">조회 랭킹</p>
		<c:forEach items="${recommendRecipe.italRankingList }" var="italRankingList">
			<li type="1" class="tabCon_kor_table_sub"href="${pageContext.request.contextPath}/readContent?recipe_code=${italRankingList.recipe_code}">${italRankingList.recipe_name }</li>
			
		</c:forEach>
	
	<hr>
</div>

</body>
</html>

<!-- 화면 스크립트 -->
<script type="text/javascript">
    // jquery 호출
    $(function(){

    });

</script>

