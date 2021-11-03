<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-10-15
  Time: 오후 2:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="e" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<html>
<head>
    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="/resources/css/main_header.css"/>
    <link rel="stylesheet" type="text/css" href="/resources/css/chat.css"/>
    <!--  -->

    <!-- Jquery -->
    <script src="/resources/js/jquery/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/jquery-ui-1.12.1/jquery-ui.js"></script>
    <!--  -->

    <!-- JavaScript -->
    <script type="text/javascript" src="/resources/js/socketChat/chat.js"></script>
    <!--  -->
    <title>socketChat</title>
</head>
<body>
    <%@ include file="../include/main_header.jsp"%>
    <!-- Container 전체 영역 -->
    <div id="container">
        <!-- Session User Data -->
        <input id="userId" type="hidden" value="${sessionScope.loginInfo.userId}"/>
        <input id="userName" type="hidden" value="${sessionScope.loginInfo.userName}"/>
        <input id="userAccess" type="hidden" value="${sessionScope.loginInfo.userAccess}"/>
        <div id="grid-area">
            <!-- 서버로부터 받아온 메시지를 렌더링하는 영역 -->
            <div id="chatting">
            </div>
            <!-- 유저들의 온라인/오프라인 상태를 표시해주는 영역 -->
            <div id="user-status-area">
                <ul id="user-status">
                </ul>
            </div>
            <!-- 전송할 메시지를 입력하는 필드 -->
            <div id="send-area">
                <input id="chatText" type="text" placeholder="메시지 입력"/>
            </div>
            <!-- 메시지 전송 버튼 영역 -->
            <div id="button-area">
                <input id="send-btn" type="button" value="보내기" onclick="send();"/>
            </div>
        </div>
    </div>
</body>
</html>