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
        .user-status-list:hover{
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
            top: 0;
            left: 100%;
            list-style: none;
            white-space: nowrap;
            border: 1px solid black;
        }
        .user-log-menu li{
            padding: 2px 10px;
        }
        .user-log-menu li:hover{
            background: black;
            color: white;
        }
        #popUp-container{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        #popUp-container > #popUpMenu{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 200px;
            background: white;
            border: 1px solid black;
        }

        #popUp-container > #popUpMenu > #close-btn{
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

        #popUp-container > #popUpMenu > #popUp-header > #popUp-title{
            height: 50px;
            text-align: center;
            line-height: 50px;
        }

        #popUp-container > #popUpMenu > #popUp-content{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 150px;
        }

        #popUp-container > #popUpMenu > #popUp-content > input[type=date]{
            width: 600px;
            height: 45px;
            font-size: 20px;
        }

        #popUp-container > #popUpMenu > #popUp-content > input[type=button]{
            width: 200px;
            height: 45px;
            font-size: 14px;
        }

        #popUp-container > #popUpLog{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 1000px;
            background: white;
            border: 1px solid black;
        }
        #popUp-container > #popUpLog > #close-btn{
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
        #popUp-container > #popUpLog > #chat-log{
            list-style: none;
            width: 100%;
            height: 950px;
            word-break:break-all;
            overflow: scroll;
            overflow-x: hidden;
        }
        #popUp-container > #popUpLog > #popUp-header {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #popUp-container > #popUpLog > #popUp-header > #popUp-title{
            height: 50px;
            text-align: center;
            line-height: 50px;
        }
        #popUp-container > #popUpLog > #popUp-header > input[type=button]{
            height: 30px;
            margin-left: 10px;
            padding: 0 10px;
        }
        #popUp-container > #popUpLog > #chat-log > .chat-log-list{
            padding: 2px 10px;
            font-size: 18px;
        }

        #popUp-container > #popUpBackUp{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 200px;
            background: white;
            border: 1px solid black;
        }

        #popUp-container > #popUpBackUp > #close-btn{
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

        #popUp-container > #popUpBackUp > #popUp-header > #popUp-title{
            height: 50px;
            text-align: center;
            line-height: 50px;
        }

        #popUp-container > #popUpBackUp > #popUp-content{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 150px;
        }

        #popUp-container > #popUpBackUp > #popUp-content > #popUp-file {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #popUp-container > #popUpBackUp > #popUp-content > #popUp-file > .upload-name{
            width: 300px;
            height: 45px;
            margin-right: 15px;
            font-size: 20px;
        }

        #popUp-container > #popUpBackUp > #popUp-content> #popUp-file > label {
            display: inline-block;
            width: 100px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background-color: #fdfdfd;
            cursor: pointer;
            border: 1px solid black;
            box-sizing: border-box;
        }

        #popUp-container > #popUpBackUp > #popUp-content > #popUp-file > input[type="file"]{
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip:rect(0,0,0,0);
            border: 0;
        }

        #popUp-container > #popUpBackUp > #popUp-content > input[type=button]{
            width: 200px;
            height: 45px;
            font-size: 14px;
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