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

    <!-- JavaScript -->
    <!--  -->
    <title>socketChat</title>
</head>
<body>
    <%@ include file="../include/main_header.jsp"%>
    <div style="display: flex; width: 100%; height: auto; flex-direction: column; align-items: center;" id="container">
        <table style="width: 1200px; height: 100%; border-left: 1px solid black; border-top: 1px solid black; border-spacing: 0;">
            <input type="hidden" id="idx" value="${param.idx}"/>
            <input type="hidden" id="user-access" value="${sessionScope.loginInfo.userAccess}"/>
            <caption style="font-size: 32px; font-weight: bold; padding: 15px 0;">문의 상세 화면</caption>
            <colgroup>
                <col width="10%">
                <col width="40%">
                <col width="10%">
                <col width="40%">
            </colgroup>
            <tr>
                <th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">문의 종류</th>
                <td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="inquire_type"></td>
                <th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">이메일</th>
                <td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="inquire_mail"></td>
            </tr>
            <tr style="height: 50px;">
                <th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">작성자</th>
                <td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="user_name"></td>
                <th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">작성일</th>
                <td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="reg_date"></td>
            </tr>
            <tr>
                <th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">제목</th>
                <td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="inquire_title" colspan="3"></td>
            </tr>
            <tr>
                <th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">내용</th>
                <td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="inquire_content" colspan="3"></td>
            </tr>
        </table>
        <div id="reply">
        </div>
        <div id="view-menu">
        </div>
    </div>
</body>
<script>
    let userAccess;

    $(document).ready(function(){
        let param = {
            idx: $("#idx").val()
        };

        userAccess = $("#user-access").val();

        getInquireData(param);
    });

    const onClickMoveList = function() {
        location.href = "/inquire";
    };

    const onClickMoveForm = function() {
        location.href ="/inquire/form?idx=" + $("#idx").val();
    };

    const getInquireData = function(formData) {
        $.ajax({
            type: "POST",
            url: "/inquire/view/load.do",
            data: formData,
            success: function(res) {
                $("#inquire_type").html(res.inquireType);
                $("#inquire_mail").html(res.inquireMail);
                $("#user_name").html((res.userName != null) ? res.userName : '탈퇴한 사용자');
                $("#reg_date").html(res.regDate);
                $("#inquire_title").html(res.inquireTitle);
                $("#inquire_content").html(res.inquireContent);

                if(res.replyChk == 0) {
                    if(userAccess == '300' || userAccess == '200') {
                        $("#view-menu").append(
                            '<input style="margin: 15px 5px 0; padding: 5px 30px; font-size: 20px; background: none;" type="button" value="목록" onClick="onClickMoveList();"/>' +
                            '<input style="margin: 15px 5px 0; padding: 5px 30px; font-size: 20px; background: none;" type="button" value="답변하기" onClick="onClickMoveForm();"/>'
                        );
                    } else {
                        $("#view-menu").append(
                            '<input style="margin: 15px 5px 0; padding: 5px 30px; font-size: 20px; background: none;" type="button" value="목록" onClick="onClickMoveList();"/>'
                        );
                    }

                } else if(res.replyChk == 1) {
                    getReplyDataByIdx(formData.idx);

                    $("#view-menu").append(
                        '<input style="margin: 15px 5px 0; padding: 5px 30px; font-size: 20px; background: none;" type="button" value="목록" onClick="onClickMoveList();"/>'
                    );
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
                alert("통신 실패");
            }
        });
    };

    const getReplyDataByIdx = function(idx) {
        let param = {
            inquireIdx: idx
        };

        $.ajax({
            type: "POST",
            url: "/inquire/view/loadreply.do",
            data: param,
            success: function(res) {
                console.log(res);
                $("#reply").append(
                    '<table style="width: 1200px; height: 100%; border-left: 1px solid black; border-top: 1px solid black; border-spacing: 0;">' +
                    '<caption style="font-size: 32px; font-weight: bold; padding: 15px 0;">문의 답변</caption>' +
                    '<colgroup>' +
                    '<col width="10%"><col width="40%"><col width="10%"><col width="40%">' +
                    '</colgroup>' +
                    '<tr style="height: 50px;">' +
                    '<th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">작성자</th>' +
                    '<td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="reply_user_name">' + res.userName + '</td>' +
                    '<th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">작성일</th>' +
                    '<td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="reply_reg_date">' + res.regDate + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">제목</th>' +
                    '<td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="reply_title" colspan="3">' + res.replyTitle + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<th style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 0;">내용</th>' +
                    '<td style="border-right: 1px solid black; border-bottom: 1px solid black; padding: 20px 10px;" id="reply_content" colspan="3">' + res.replyContent + '</td>' +
                    '</tr>' +
                    '</table>'
                );
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
                alert("통신 실패");
            }
        });
    };
</script>
</html>