<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-10-15
  Time: 오후 2:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <!-- Css -->
    <link rel="stylesheet" type="text/css" href="/resources/css/login.css"/>
    <!--  -->

    <!-- Jquery -->
    <script src="/resources/js/jquery/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/jquery-ui-1.12.1/jquery-ui.js"></script>
    <!--  -->

    <!-- JavaScript -->
    <script type="text/javascript" src="resources/js/login.js"></script>
    <!--  -->
    <title>socketChat</title>
</head>
<body>
    <!-- Container 전체 영역 -->
    <div id="container">
        <!-- Login Form 영역 -->
        <form id="login-area">
            <fieldset id="login-field">
                <legend id="login-field-title">로그인</legend>
                <!-- Login Form Table 영역 -->
                <table id="login-field-table">
                    <tr>
                        <th><label class="login-field-table-label">아이디</label></th>
                        <td><input id="userId" class="login-field-table-input" type="text"/></td>
                    </tr>
                    <tr>
                        <th><label class="login-field-table-label">비밀번호</label></th>
                        <td><input id="userPwd" class="login-field-table-input" type="password"/></td>
                    </tr>
                    <tr>
                        <th colspan="2">
                            <input class="login-field-table-button" type="button" value="로그인" onClick="$.login();"/>
                            <input class="login-field-table-button" type="button" value="회원가입" onClick="$.moveSignUp();"/>
                        </th>
                    </tr>
                </table>
            </fieldset>
        </form>
    </div>
</body>
</html>
