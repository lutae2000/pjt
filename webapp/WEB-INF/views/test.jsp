<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/jquery-1.10.2.min.js"></script>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<div>
	<input id = "btn" type="button" value="jsTestButton" />
	<h1 id="display">이름출력 영역</h1>
</div>

<div>
	<input id = "btn1" type="button" value="jsTestButton" />
	<input id="btn2" type="button" value="clear" />
	<h1 id="display1">이름출력 영역</h1>
</div>


<div>
	<ol>
		<li>첫번째</li>
	</ol>
</div>


</body>

<script type="text/javascript">
	$("#btn").on("click",function(){
		$("#display").html("<font color='red'>홍길동<font>");
	});
	
	$('#btn1').on("click",function(){
		$('#display1').append("<strong>가나다라마바사아자차카타라하</strong>");
		});
	$('#btn2').on("click",function(){
		$('display1').empty();
	});

</script>
</html>