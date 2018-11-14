<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<form id="search" action="${pageContext.request.contextPath }/list/search" method="get">
    	<input type="text" id="kwd" name="kwd" placeholder="메뉴 검색">
    	<input type="submit" value="검색">
    </form>

총 ${selectedIngreResultMap.totalCount } 레시피중 ${selectedIngreResultMap.searchCount }개가 검색되었습니다

<hr>

<c:forEach items="${selectedIngreResultMap.std_info_List }" var="vo">
	<tr>
		<td>
			<a href="${pageContext.request.contextPath }/readContent?recipe_code=${vo.recipe_code}"> ${vo.recipe_name}<img src="${vo.img_url }" width="300"></a>

		</td>
	</tr>
</c:forEach>

</body>
</html>