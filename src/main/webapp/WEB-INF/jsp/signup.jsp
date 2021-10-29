<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-10-18
  Time: 오후 2:36
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <!-- Css -->
    <link rel="stylesheet" type="text/css" href="/resources/css/signup.css"/>
    <!--  -->

    <!-- Jquery -->
    <script src="/resources/js/jquery/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/jquery-ui-1.12.1/jquery-ui.js"></script>
    <!--  -->

    <!-- JavaScript -->
    <script type="text/javascript" src="/resources/js/signup.js"></script>
    <!--  -->
    <title>socketChat</title>
</head>
<body>
<!-- Container 전체 영역 -->
<div id="container">
    <!-- Signup Form 영역 -->
    <form id="signup-area">
        <fieldset id="signup-field">
            <legend id="signup-field-title">회원가입</legend>
            <!-- Signup Form Table 영역 -->
            <table id="signup-field-table">
                <tr>
                    <th><label class="signup-field-table-label">아이디</label></th>
                    <td><input id="userId" class="signup-field-table-input" type="text"/></td>
                </tr>
                <tr>
                    <th><label class="signup-field-table-label">사용자 이름</label></th>
                    <td><input id="userName" class="signup-field-table-input" type="text"/></td>
                </tr>
                <tr>
                    <th><label class="signup-field-table-label">비밀번호</label></th>
                    <td><input id="userPwd" class="signup-field-table-input" type="password"/></td>
                </tr>
                <tr>
                    <th><label class="signup-field-table-label">비밀번호 확인</label></th>
                    <td><input id="userPwdChk" class="signup-field-table-input" type="password"/></td>
                </tr>
                <tr>
                    <th colspan="2">
                        <input class="signup-field-table-button" type="button" value="회원가입" onClick="$.signup();"/>
                        <input class="signup-field-table-button" type="button" value="로그인 화면" onClick="$.moveLogin();"/>
                    </th>
                </tr>
            </table>
        </fieldset>
    </form>
</div>
</body>
</html>
