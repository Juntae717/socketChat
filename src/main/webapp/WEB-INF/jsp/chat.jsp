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
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        .user-status-list{
            position: relative;
            padding: 2px 10px;
            cursor: pointer;
            overflow: hidden;
        }
        .user-status-list:hover {
            overflow: visible;
        }
        .user-status-online > span{
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 5px;
            border-radius: 50%;
            background: green;
        }
        .user-status-offline > span{
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 5px;
            border-radius: 50%;
            background: gray;
        }
        .user-log-menu{
            position: absolute;
            top: 0; left: 100%;
            white-space: nowrap;
            padding: 2px 10px;
            border: 1px solid black;
        }
        #popUp-container{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        #popUp-container > #popUp{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 1000px;
            background: white;
            border: 1px solid black;
        }
        #popUp-container > #popUp > #close-btn{
            position: absolute;
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            background: red;
            text-align: center;
            line-height: 50px;
            font-size: 30px;
            color: white;
            cursor: pointer;
        }
        #popUp-container > #popUp > #chat-log{
            list-style: none;
            width: 100%;
            height: 950px;
            word-break:break-all;
            overflow: scroll;
            overflow-x: hidden;
        }
        #popUp-container > #popUp > #chat-log-title{
            height: 50px;
            text-align: center;
            line-height: 50px;
        }
        #popUp-container > #popUp > #chat-log > .chat-log-list{
            padding: 2px 10px;
            font-size: 18px;
        }
    </style>

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
            <div style="border-right: 1px solid black; border-bottom: 1px solid black;">
                <ul style="margin: 0; padding: 0; list-style: none;" id="user-status">
                </ul>
            </div>
            <div style="border-right: 1px solid black; border-bottom: 1px solid black;">
                <input style="width: 100%; height: 100%; font-size: 18px; border: none; outline: none;" id="chatText" type="text" placeholder="메시지 입력"/>
            </div>
            <div style="border-right: 1px solid black; border-bottom: 1px solid black;">
                <input style="width: 100%; height: 100%; font-size: 18px; background: none; border: none; outline: none; cursor: pointer" type="button" value="보내기" onclick="send();"/>
            </div>
        </div>
    </div>
</body>
</html>
