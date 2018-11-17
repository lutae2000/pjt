<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<style>
.ingreSelect_title {margin: 0 auto 8px;width: 125px;height: 26px;text-align: center;line-height: 26px;border-radius: 14px;font-size: 15px;color: #fff;}
.ingreSelect_table {
    margin: 15px;
    background: #fff;
    padding: 10px;
    border: 2px solid #b0c9ff;
}

*{font-family: 'Roboto', sans-serif;}

@keyframes click-wave {
  0% {
    height: 20px;
    width: 20px;
    opacity: 0.35;
    position: relative;
  }
  100% {
    height: 100px;
    width: 100px;
    margin-left: -40px;
    margin-top: -40px;
    opacity: 0;
  }
}

.option-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  position: relative;
  top: 8.33333px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 20px;
  width: 20px;
  transition: all 0.15s ease-out 0s;
  background: #cbd1d8;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.5rem;
  outline: none;
  position: relative;
  z-index: 1000;
}
.option-input:hover {
  background: #9faab7;
}
.option-input:checked {
  background: #40e0d0;
}
.option-input:checked::before {
  height: 20px;
  width: 20px;
  position: absolute;
  content: '✔';
  display: inline-block;
  font-size: 13.33337px;
  text-align: center;
  line-height: 20px;
}
.option-input:checked::after {
  -webkit-animation: click-wave 0.65s;
  -moz-animation: click-wave 0.65s;
  animation: click-wave 0.65s;
  background: #40e0d0;
  content: '';
  display: block;
  position: relative;
  z-index: 100;
}
.option-input.radio {
  border-radius: 50%;
}
.option-input.radio::after {
  border-radius: 50%;
}

body {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: box;
  background: #e8ebee;
  color: #9faab7;
  font-family: "Helvetica Neue", "Helvetica", "Roboto", "Arial", sans-serif;
  text-align: center;
}
body div {
  padding: 5rem;
}
body label {
  display: block;
  line-height: 20px;
}

</style>
</head>
<body>
<form class="ingreSelect" method="post" action="${pageContext.request.contextPath }/recipeResult">
	
	<b class="ingreSelect_title" style="background-color:#ca93e3;">고기류</b><br>
	<ul class="ingreSelect_table">
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="쇠고기">쇠고기
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="닭고기">닭고기
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="닭가슴살">닭가슴살
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="닭다리">닭다리
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="돼지갈비">돼지갈비
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="돼지고기">돼지고기
	</ul>
	<hr>
	
	<b>해산물</b><br>
	<ul class="ingreSelect_table">
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="갈치">갈치
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="고등어">고등어
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="굴">굴
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="꽁치">꽁치
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="낙지">낙지
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="도미">도미
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="멸치">멸치
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="바지락">바지락
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="새우">새우
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="오징어">오징어
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="조개">조개
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="쭈꾸미">쭈꾸미
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="참치">참치
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="홍합">홍합
	</ul>
	<hr>
	
	
	
	
	<b>조미료</b><br>
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="간장">간장
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="식초">식초
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="설탕">설탕
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="국간장">국간장
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="진간장">진간장
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="고추장">고추장
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="후추">후추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="꿀">참기름
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="들기름">들기름
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="맛술">맛술
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="물엿">물엿
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="토마토케찹">토마토케찹
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="올리브유">올리브유
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="마요네즈">마요네즈
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="굴소스">굴소스
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="고춧가루">고춧가루
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="된장">된장
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="와사비">와사비
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="소금">소금
	
	
	
	<hr>
	<b>채소류</b><br>
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="양파">양파
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="쪽파">쪽파
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="대파">대파
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="호박">호박
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="오이">오이
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="가지">가지
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="셀러리">셀러리
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="건블루베리">건블루베리
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="당근">당근
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="콩나물">콩나물
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="시금치">시금치
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="애호박">애호박
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="청양고추">청양고추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="양배추">양배추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="감자">감자
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="고구마">고구마
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="고사리">고사리
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="고추">고추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="깻잎">깻잎
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="도라지">도라지
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="마늘">마늘
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="무">무
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="무순">무순
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="미나리">미나리
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="방울토마토">방울토마토
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="배추">배추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="부추">부추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="상추">상추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="생강">생강
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="숙주">숙주
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="실파">실파
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="쑥">쑥
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="양상추">양상추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="죽순">죽순
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="토마토">토마토
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="파프리카">파프리카
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="피망">피망
	
	
	<hr>
	
	
	<b>버섯류</b><br>
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="느타리버섯">느타리버섯
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="목이버섯">목이버섯
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="새송이버섯">새송이버섯
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="양송이머섯">양송이버섯
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="팽이버섯">팽이버섯
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="표고버섯">표고버섯
	
	<hr>
	<b>기타재료</b><br>
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="바질">바질
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="매실액">매실액
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="게맛살">게맛살
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="계란">계란
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="김">김
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="꿀">꿀
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="녹말">녹말
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="다시마">다시마
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="당면">당면
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="대추">대추
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="두부">두부
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="미역">미역
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="밀가루">밀가루
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="밤">밤
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="밥">밥
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="배">배
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="배추김치">배추김치
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="버터">버터
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="베이컨">베이컨
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="소면">소면
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="스파게티">스파게티 면
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="식용유">식용유
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="쌀">쌀
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="올리브유">올리브유
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="우유">우유
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="잣">잣
	
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="찹쌀">찹쌀
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="찹쌀가루">찹쌀가루
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="통깨">통깨
	<input type="checkbox" class="option-input checkbox" name="ingreInfo" value="파슬리">파슬리
	
	<br><input type="submit">
</form>




</body>
</html>