<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>


<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>레시피...</title>


<link rel="stylesheet" href="${pageContext.request.contextPath }/assets/css/index.css" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/libs/jquery/jquery.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/libs/jquery/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/libs/instance/instance.ui.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/assets/js/ui/view.js"></script>
<script type="text/javaScript" language="javascript">

</script>
<style>
.mypage_menu{margin: 15px;/* border-top: 1px solid #e9e9e9; */background:#fff;}
.mypage_menu li {float:left;width: 50%;text-align: center;border: 12px solid #e9e9e9;/* border-left: 15px solid #e9e9e9; */box-sizing:border-box;height:120px;position:relative;}
.mypage_menu li img{width:100%;max-width:200px}
.mypage_menu li:nth-child(2n){/* border-right:1px solid #e9e9e9 */}
.mypage_menu:after{display:block;content:'';clear:both;}

/* .mypage_menu li.menu01{background:url(../images/icon_mypage_menu01.png) center 20px no-repeat;background-size:50px;}
.mypage_menu li.menu02{background:url(../images/icon_mypage_menu02.png) center 20px no-repeat;background-size:50px;}
.mypage_menu li.menu03{background:url(../images/icon_mypage_menu03.png) center 20px no-repeat;background-size:50px;}
.mypage_menu li.menu04{background:url(../images/icon_mypage_menu04.png) center 20px no-repeat;background-size:50px;} */
.mypage_menu li a{display: block;padding-top: 72px;box-shadow: border-box;font-size:15px;color:#333333;}
</style>


</head>
<body>
<div class="header_wrap" id="top">
    <div class="header">
        <h1 class="logo"><a href="./main.html"><img src="./images/logo.png" alt="피트모아"></a></h1>
        <span class="menu"><a href="javascript:fn_back();"><img src="./images/menu.png" alt="메뉴"></a></span>
        <span class="mypage"><a href="./sub102.html"><img src="./images/mypage.png" alt="마이페이지"></a></span>
    </div>
</div>

<div class="wrap" >
    <form id="board-form" name="board-form" action="cook.mainList" >
        <input type="hidden" id="page" name="page" value="1" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="hidden" id="totalCount" name="totalCount" value="0" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="hidden" id="pageBlock_Og" name="pageBlock_Og" value="6" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="hidden" id="pageBlock" name="pageBlock" value="6" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="hidden" id="RECIPE_NAME" name="RECIPE_NAME" value="" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="hidden" id="searchOption" name="searchOption" value="0" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="hidden" id="test" name=""test"" value="0" placeholder="" readonly required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />				
    </form>
<!--     <div class="search_input pb0">        
        <input type="text"  class="searchWrd"  name="kwd" value='' onkeypress="press(event);" title="검색어 입력" />	
        <span class="searchbtn"><a href="list/search">검색</a></span>        
    </div> -->
    <%-- <p class="search_txt">총 <strong>${list.totalCount }</strong>메뉴 중 <span>${list.searchedCount }</span>개의 메뉴가 검색되었습니다.</p>
 --%>
<%-- ${list.totalCount }개중 ${list.searchedCount }개 --%>
    <div class="bg_box" id="bg_box01" style="display:none;">
    	<p class="search_txt" id="totalCntView" name="totalCntView"></p>
    </div>
    
    
      <form id="search" action="${pageContext.request.contextPath }/list/search" method="get">
    	<input type="text" id="kwd" name="kwd" placeholder="메뉴 검색">
    	<input type="submit" value="검색">
    </form>
    
    
 	<table>
	<c:forEach items="${list}" var="vo">
		<tr>
			<td>${vo.recipe_name }</td>
			
			 <td>
			 	<a href="${pageContext.request.contextPath}/readContent?recipe_code=${vo.recipe_code }"><img src="${vo.img_url}" width="300"></a>
			 </td> 
			 
		</tr>
	</c:forEach>
	</table>
    
    
	<div id="tabCon01"></div>
    <!-- <p class="title">요리 테이블 목록</p> -->
    
    <!-- <div class="center_list">
            <ul class="mypage_menu">
                    <li class="menu01"><a href="#" id="table_cook1">요리 테이블</a></li>
                    <li class="menu02"><a href="#" id="table_cook2">요리 테이블</a></li>
                    <li class="menu03"><a href="#" id="table_cook">요리 테이블</a></li>
                    <li class="menu04"><a href="#" id="table_cook">요리 테이블</a></li>
                    <li class="menu05"><a href="#" id="table_cook">요리 테이블</a></li>
                    <li class="menu06"><a href="#" id="table_cook">요리 테이블</a></li>		
                </ul>	
    </div> -->
    <div class="btn_wrap list_long_btn">
        <a class="btn_long02" onclick="fn_more();"><span class="more">더보기</span></a>
    </div>

</div>


<div class="menu_wrap" id="bottom">
    <div class="menu">
        <ul>
            <li class="mycenter"><a href="#">요리선택</a></li>
            <li class="center on"><a href="#">재료선택</a></li>
            <li class="health "><a href="#">맛집추천</a></li>
            <li class="help"><a href="#">쇼핑몰이동</a></li>
        </ul>
    </div>
</div>


	
</body>
</html>
