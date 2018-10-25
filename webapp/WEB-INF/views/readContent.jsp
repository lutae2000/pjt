<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<h1>${recipe.std_info_Vo.recipe_name} </h1>
<img src="${recipe.std_info_Vo.img_url }" width="300">
	
	
<hr>


<table>
	<tr>
		<td><h3>요리재료 (${recipe.std_info_Vo.quantity }) 기준</h3></td>
	</tr>
	<tr>
		<td>
			<c:forEach items="${recipe.ingreList}" var="vo">
			${vo.ingre_name}
			</c:forEach>
		</td>
	</tr>
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
<table>
	<c:forEach items="${recipe.howtocookList }" var="htcl">
	<tr>
		<td>${htcl.how_to_cook }</td>
		<td><img src="${htcl.how_to_cook_img }" width="200"></td>
	</tr>
	
	</c:forEach>
	
	
</table>

<hr>
<h4>조리 팁</h4>
<table>
<c:forEach items="${recipe.howtocookList }" var="htc">
	<tr>
		<td>${htc.tip }</td>
	</tr>
	</c:forEach>
</table>			
</body>
</html>