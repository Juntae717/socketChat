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
    <script src="/resources/js/jquery/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/jquery-ui-1.12.1/jquery-ui.js"></script>

    <script type="text/javascript" src="resources/js/login.js"></script>
    <title>socketChat</title>
</head>
<body>
    <div style="display: flex; width: 100%; height: 100%; align-items: center;">
        <form style="margin: 0 auto;">
            <fieldset style="padding: 150px 70px;">
                <legend style="font-size: 32px; text-align: center;">로그인</legend>
                <table style="font-size: 20px; border-spacing: 30px;">
                    <tr>
                        <th><label style="font-size: 26px;">아이디</label></th>
                        <td><input style="width: 300px; height: 40px;" id="userId" type="text"/></td>
                    </tr>
                    <tr>
                        <th><label style="font-size: 26px;">비밀번호</label></th>
                        <td><input style="width: 300px; height: 40px;" id="userPwd" type="password"/></td>
                    </tr>
                    <tr>
                        <th colspan="2">
                            <input style="padding: 5px 30px; font-size: 20px; background: none;" type="button" value="로그인" onClick="$.login();"/>
                            <input style="padding: 5px 30px; font-size: 20px; background: none;" type="button" value="회원가입" onClick="$.moveSignUp();"/>
                        </th>
                    </tr>
                </table>
            </fieldset>
        </form>
    </div>
</body>
</html>
