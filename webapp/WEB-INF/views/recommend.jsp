<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>



<!-- 한식부분 -->
<h2>한식 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendKorList}" var="recommendKorList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendKorList.recipe_code }">${recommendKorList.recipe_name } <img src="${recommendKorList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.korRankingList }" var="korRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${korRankingList.recipe_code}">${korRankingList.recipe_name }</a></td>
		
	</tr>
	</c:forEach>
</table>

<hr>

<!-- 중식부분 -->
<h2>중식 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendChnList}" var="recommendChnList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendChnList.recipe_code }">${recommendChnList.recipe_name } <img src="${recommendChnList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.chnRankingList }" var="chnRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${chnRankingList.recipe_code}">${chnRankingList.recipe_name }</a></td>
		
	</tr>
	</c:forEach>
</table>

<hr>

<!-- 일식부분 -->
<h2>일식 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendJpnList}" var="recommendJpnList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendJpnList.recipe_code }">${recommendJpnList.recipe_name } <img src="${recommendJpnList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.jpnRankingList }" var="jpnRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${jpnRankingList.recipe_code}">${jpnRankingList.recipe_name }</a></td>
		
	</tr>
	</c:forEach>
</table>

<hr>


<!-- 동양식부분 -->
<h2>동양식 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendEastList}" var="recommendEastList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendEastList.recipe_code }">${recommendEastList.recipe_name } <img src="${recommendEastList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.eastRankingList }" var="eastRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${eastRankingList.recipe_code}">${eastRankingList.recipe_name }</a></td>
		
	</tr>
	</c:forEach>
</table>

<hr>

<!-- 퓨전부분 -->
<h2>퓨전 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendFusList}" var="recommendFusList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendFusList.recipe_code }">${recommendFusList.recipe_name } <img src="${recommendFusList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.fusRankingList }" var="fusRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${fusRankingList.recipe_code}">${fusRankingList.recipe_name }</a></td>
		
	</tr>
	</c:forEach>
</table>

<hr>

<!-- 서양식부분 -->
<h2>서양식 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendWestList}" var="recommendWestList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendWestList.recipe_code }">${recommendWestList.recipe_name } <img src="${recommendWestList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.westRankingList }" var="westRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${westRankingList.recipe_code}">${westRankingList.recipe_name }</a></td>
		
	</tr>
	</c:forEach>
</table>

<hr>

<!-- 이탈리아식 부분 -->
<h2>이탈리아식 추천 메뉴</h2>
<c:forEach items="${recommendRecipe.recommendItalList}" var="recommendItalList">
	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${recommendItalList.recipe_code }">${recommendItalList.recipe_name } <img src="${recommendItalList.img_url }" width="200"></a>
	
</c:forEach>
<h2>조회랭킹</h2>
<table>
	<c:forEach items="${recommendRecipe.italRankingList }" var="italRankingList">
	<tr>
		<td><a href="${pageContext.request.contextPath}/readContent?recipe_code=${italRankingList.recipe_code}">${italRankingList.recipe_name }</a></td>
	</tr>
	</c:forEach>
</table>

</body>
</html>