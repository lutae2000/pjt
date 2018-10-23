<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<form>
     <label for="search-1">Search:</label>
     <input type="search" name="search-1" id="search-1" value="">
 <table>
		<thead>
			<tr>
				<th>레시피번호</th>
				<th>음식이름</th>
				<th>종류</th>
				<th>난이도</th>
				<th>가격</th>
				<th>이미지</th>
			</tr>
		</thead>
		
		<tbody>
			<c:forEach items="${allList }" var="userVo">
			<tr>
				<td>${userVo.recipe_code}</td>
				<td>${userVo.recipe_name}</td>
				<td>${userVo.food_class}</td>
				<td>${userVo.difficult}</td>
				<td>${userVo.price_class}</td>
				<td><img src="${userVo.img_url}"></td>
			</tr>
			</c:forEach>
		</tbody>
	</table> 
</form>
</body>
</html>