<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-10-29
  Time: 오후 1:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="e" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
    <!-- Css -->
    <link rel="stylesheet" type="text/css" href="/resources/css/main_header.css"/>
    <!--  -->

    <!-- Jquery -->
    <script src="/resources/js/jquery/jquery-3.2.1.min.js"></script>
    <script src="/resources/js/jquery-ui-1.12.1/jquery-ui.js"></script>
    <!--  -->

    <!-- Summernote -->
    <script src="/resources/summernote/summernote-lite.js"></script>
    <script src="/resources/summernote/lang/summernote-ko-KR.js"></script>
    <link rel="stylesheet" href="/resources/summernote/summernote-lite.css">
    <!--  -->

    <!-- JavaScript -->
    <script type="text/javascript" src="/resources/js/Inquire/form.js"></script>
    <!--  -->
    <title>socketChat</title>
</head>
<body>
<%@ include file="../include/main_header.jsp"%>
<div style="display: flex; width: 100%; height: 100%; justify-content: center;" id="container">
    <input id="userIdx" type="hidden" value="${sessionScope.loginInfo.idx}"/>
    <c:choose>
        <c:when test="${param.idx == null}">
            <!-- inquire Form 영역 -->
            <form id="inquire-form">
                <fieldset style="padding: 70px 30px;">
                    <legend style="font-size: 32px; text-align: center;">문의 등록</legend>
                    <!-- Login Form Table 영역 -->
                    <table style="font-size: 20px; border-spacing: 30px;" id="inquire-field-table">
                        <tr>
                            <th><label style="font-size: 26px;" id="inquireType-label" class="login-field-table-label">문의 종류</label></th>
                            <td>
                                <input id="inquireTypeIM" name="inquireType" type="radio" value="IM"/>
                                <label for="inquireTypeIM">개선</label>
                                <input id="inquireTypeER" name="inquireType" type="radio" value="ER"/>
                                <label for="inquireTypeER">오류</label>
                                <input id="inquireTypeET" name="inquireType" type="radio" value="ET"/>
                                <label for="inquireTypeET">기타</label>
                            </td>
                        </tr>
                        <tr>
                            <th><label style="font-size: 26px;" id="inquireTitle-label" class="login-field-table-label">제목</label></th>
                            <td><input style="width: 400px; height: 40px;" id="inquireTitle" class="login-field-table-input" type="text"/></td>
                        </tr>
                        <tr>
                            <th><label style="font-size: 26px;" id="inquireMail-label" class="login-field-table-label">이메일</label></th>
                            <td>
                                <input style="width: 150px; height: 40px; ime-mode:disabled;" id="inquireMailName" class="login-field-table-input" type="text"/>
                                <span>@</span>
                                <input style="width: 150px; height: 40px; ime-mode:disabled;" id="inquireMailDomain" class="login-field-table-input" type="text" onKeydown="onKeydowninquireMailDomain();"/>
                                <select id="select-box" style="height: 40px;" onChange="onChangeSelectBox(this);">
                                    <option value="" selected disabled>직접 입력</option>
                                    <option value="kiwontech.com">kiwontech.com</option>
                                    <option value="naver.com">naver.com</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label style="font-size: 26px;" id="inquireContent-label">내용</label></th>
                            <td>
                                <textarea style="width: 400px; height: 300px; resize: none;" class="summernote"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <input style="padding: 5px 30px; font-size: 20px; background: none;" type="button" value="등록" onClick="onClickSave();"/>
                                <input style="padding: 5px 30px; font-size: 20px; background: none;" type="button" value="취소" onClick="onClickMoveList();"/>
                            </th>
                        </tr>
                    </table>
                </fieldset>
            </form>
        </c:when>
        <c:otherwise>
            <form id="reply-form">
                <fieldset style="padding: 70px 30px;">
                    <legend style="font-size: 32px; text-align: center;">답변 등록</legend>
                    <table style="font-size: 20px; border-spacing: 30px;" id="reply-field-table">
                        <tr>
                            <th><label style="font-size: 26px;" id="replyTitle-label" class="login-field-table-label">제목</label></th>
                            <td><input style="width: 400px; height: 40px;" id="replyTitle" class="login-field-table-input" type="text"/></td>
                        </tr>
                        <tr>
                            <th><label style="font-size: 26px;" id="replyContent-label">내용</label></th>
                            <td>
                                <textarea style="width: 400px; height: 300px; resize: none;" class="summernote"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <input style="padding: 5px 30px; font-size: 20px; background: none;" type="button" value="등록" onClick="onClickSaveReply(${param.idx});"/>
                                <input style="padding: 5px 30px; font-size: 20px; background: none;" type="button" value="취소" onClick="onClickMoveView(${param.idx});"/>
                            </th>
                        </tr>
                    </table>
                </fieldset>
            </form>
        </c:otherwise>
    </c:choose>
</div>
</body>
</html>