<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-10-15
  Time: 오후 2:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <script src="/resources/js/jquery/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/jquery-ui-1.12.1/jquery-ui.js"></script>

    <script type="text/javascript" src="/resources/js/chat.js"></script>
    <title>socketChat</title>
</head>
<body>
    <div style="display: flex; width: 100%; height: 100%; align-items: center;">
        <input id="userId" type="hidden" value="${sessionScope.loginInfo.userId}"/>
        <input id="userName" type="hidden" value="${sessionScope.loginInfo.userName}"/>
        <div style="display: grid; grid-template-columns: 1050px 150px; grid-template-rows: 520px 80px; width: 1200px; height: 600px; margin: 0 auto; border-top: 1px solid black; border-left: 1px solid black;">
            <div style="padding: 0 10px; border-right: 1px solid black; border-bottom: 1px solid black; word-break:break-all; overflow: scroll; overflow-x: hidden;" id="chatting">
            </div>
            <div style="border-right: 1px solid black; border-bottom: 1px solid black;">On/Off</div>
            <div style="border-right: 1px solid black; border-bottom: 1px solid black;">
                <input style="width: 100%; height: 100%; font-size: 18px; border: none; outline: none;" id="chatText" type="text" placeholder="메시지 입력"/>
            </div>
            <div style="border-right: 1px solid black; border-bottom: 1px solid black;">
                <input style="width: 100%; height: 100%; font-size: 18px; background: none; border: none; outline: none; cursor: pointer" type="button" value="보내기"/>
            </div>
        </div>
    </div>
</body>
</html>
