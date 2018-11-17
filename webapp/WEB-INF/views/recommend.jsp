<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="${pageContext.request.contextPath }/assets/css/index.css" type="text/css" />
<style>
.tabCon_kor_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e6e9f9, #b6bcf4);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}
.tabCon_Chn_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #f3e6f9, #d9b6f4);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}
.tabCon_Jpn_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e3fffc, #b5eae8);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}
.tabCon_East_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, rgb(246, 249, 230), #f4f0b6);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}
.tabCon_Fus_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #f9e6e8, #f4b6be);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}
.tabCon_West_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e6f8f9, #b6ebf4);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}
.tabCon_Ital_title{border-top:1px solid #f4f4f4;color: #686868;height:50px;line-height:50px;background: linear-gradient(106deg, #e6f9ee, #b6f4dc);font-size: 30px;padding-left: 25px;font-weight: 800;transition: padding 0.5s ease-out;}

.tabCon_kor_table_sub {padding-left: 10px; color: #fff; background:#4c73c6; font-size:17pt; font-weight: 700; border-bottom: 1px solid #dfdfdf;}

.tabCon_kor_list_mypage_menu{margin: 15px;/* border-top: 1px solid #e9e9e9; */background:#fff;}
.tabCon_kor_table_img{width:100%;/* max-width:200px; */max-height: 160px;}
.tabCon_kor_list_mypage_menu li:nth-child(2n){/* border-right:1px solid #e9e9e9 */}
.tabCon_kor_list_mypage_menu:after{display:block;content:'';clear:both;}

.tabCon_kor_table_menu{display: block;/* margin-top: 96px; */box-shadow: border-box;font-size: 25px;font-weight: 800;background: black;color: #fff;opacity: 0.6;height: 20%;/* width:200px; */text-align: center;}
</style>
</head>
<body>


<div id="tabCon_kor">
<p class="tabCon_kor_title">한식 추천 메뉴</p>
<div class="tabCon_kor_list">
	<ul class="tabCon_kor_list_mypage_menu">
		<c:forEach items="${recommendRecipe.recommendKorList}" var="recommendKorList">
		<img class="tabCon_kor_table_img" src="${recommendKorList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendKorList.recipe_code }" class="tabCon_kor_table_menu">${recommendKorList.recipe_name }</a>
		
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
			<img class="tabCon_kor_table_img" src="${recommendChnList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendChnList.recipe_code }" class="tabCon_kor_table_menu">${recommendChnList.recipe_name }</a>
			
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
			<img class="tabCon_kor_table_img" src="${recommendJpnList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendJpnList.recipe_code }" class="tabCon_kor_table_menu">${recommendJpnList.recipe_name }</a>
			
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
			<img class="tabCon_kor_table_img" src="${recommendEastList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendEastList.recipe_code }" class="tabCon_kor_table_menu">${recommendEastList.recipe_name }</a>
			
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
			<img class="tabCon_kor_table_img" src="${recommendFusList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendFusList.recipe_code }" class="tabCon_kor_table_menu">${recommendFusList.recipe_name }</a>
			
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
			<img class="tabCon_kor_table_img" src="${recommendWestList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendWestList.recipe_code }" class="tabCon_kor_table_menu">${recommendWestList.recipe_name }</a>
			
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
			<img class="tabCon_kor_table_img" src="${recommendItalList.img_url }"/> <a src="${pageContext.request.contextPath}/readContent?recipe_code=${recommendItalList.recipe_code }" class="tabCon_kor_table_menu">${recommendItalList.recipe_name }</a>
			
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