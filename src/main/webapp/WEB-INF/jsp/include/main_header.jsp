<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-11-02
  Time: 오후 1:46
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<header>
    <nav id="header-menu">
        <!-- Menu area -->
    </nav>
</header>
<script>
    $(document).ready(function(){
        loadMenuData();
    });

    const loadMenuData = function() {
        $.ajax({
            type: "POST",
            url: "/loadmenu.do",
            success: function(res) {
                let menuStr = "";
                for(const key in res) {
                    menuStr += '<span><a href="' + res[key].menuHref + '">' + res[key].menuName + '</a></span>';
                }
                $("#header-menu").append(menuStr);

                // 로그아웃 API
                $("#header-menu").append(
                    '<span><a href="" onClick="$.logout();">로그아웃</a></span>'
                );
            },
            error: function() {
                alert("통신 실패");
            }
        });
    };

    /**
     * FUNCITON :: 로그아웃 요청
     */
    $.logout = function() {
        const param = {};

        $.ajax({
            type: "GET",
            url: "/logout.do",
            data: param,
            success: function(res) {
                location.replace("/");
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
                alert("통신 실패");
            }
        });
    };
</script>
