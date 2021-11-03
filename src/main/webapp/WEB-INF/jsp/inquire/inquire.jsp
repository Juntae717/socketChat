<%--
  Created by IntelliJ IDEA.
  User: zhdh1
  Date: 2021-10-29
  Time: 오후 1:07
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<head>
    <!-- Css -->
    <link rel="stylesheet" type="text/css" href="/resources/css/main_header.css"/>
    <style>
        *{
            margin: 0;
        }

        ul, li{
            list-style: none;
        }

        #container {
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            align-items: center;
        }

        #inquire-header {
            display: flex;
            width: 1200px;
            height: 50px;
            justify-content: space-around;
            align-items: center;
            border-bottom: 1px solid black;
        }

        .inquire-search-cnt {
            font-size: 20px;
        }

        .inquire-search-menu {
            display: flex;
            width: 450px;
            height: auto;
            justify-content: space-between;
            padding: 0;
            font-size: 20px;
        }

        #search-result-field {
            width: 1200px;
            border-left: 1px solid black;
            border-spacing: 0;
        }

        .search-result-head {
            border-right: 1px solid black;
            border-bottom: 1px solid black;
            padding: 10px 0;
        }

        .search-result-data {
            border-right: 1px solid black;
            border-bottom: 1px solid black;
            padding: 5px;
        }

        .search-result-data a {
            color: #000;
            text-decoration: none;
        }

        #paging-nav {
            margin-top: 20px;
        }

        .paging-nav-arrow {
            display: inline-block;
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            cursor: pointer;
        }

        .paging-nav-number {
            display: inline-block;
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            margin: 0 5px;
            border: 1px solid black;
            cursor: pointer;
        }

        .paging-nav-number.active {
            color: white;
            background-color: black;
        }
    </style>
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
    <div id="container">
        <nav id="inquire-header">
            <span class="inquire-search-cnt">총 0건</span>
            <ul class="inquire-search-menu">
                <li>
                    <select id="inquireType" style="width: 100px; height: 30px;">
                        <option value="">문의 종류</option>
                        <option value="IM">개선</option>
                        <option value="ER">오류</option>
                        <option value="ET">기타</option>
                    </select>
                </li>
                <li>
                    <select id="searchType" style="width: 120px; height: 30px;">
                        <option value="A">전체</option>
                        <option value="T">제목</option>
                        <option value="W">작성자</option>
                    </select>
                </li>
                <li style="display: flex;">
                    <input style="height: 30px;" id="searchData" type="text" placeholder="검색" autocomplete="false">
                    <input style="padding: 0 10px; background: none;" type="button" value="검색" onClick="onClickSearchData();"/>
                </li>
            </ul>
        </nav>
        <!-- list area -->
        <table id="search-result-field">
            <tr>
                <th class="search-result-head">검색 결과가 존재하지 않습니다.</th>
            </tr>
        </table>
        <div id="paging-field">

        </div>
        <input style="margin-top: 10px; padding: 5px 30px; font-size: 20px; background: none;" type="button" value="등록" onClick="onClickMoveForm();"/>
    </div>
</body>
<script>
    let Paging = function() {
        this.pageSize = 0; // 게시 글 수
        this.firstPageNo; // 첫 번째 페이지 번호
        this.prevPageNo; // 이전 페이지 번호
        this.startPageNo; // 시작 페이지 (페이징 네비 기준)
        this.pageNo = 0; // 페이지 번호
        this.endPageNo; // 끝 페이지 (페이징 네비 기준)
        this.nextPageNo; // 다음 페이지 번호
        this.finalPageNo; // 마지막 페이지 번호
        this.totalCount; // 게시 글 전체 수
    };

    Paging.prototype.getPageSize = function() {
        return this.pageSize;
    };

    Paging.prototype.setPageSize = function(val) {
        this.pageSize = val;
    };

    Paging.prototype.getFirstPageNo = function() {
        return this.firstPageNo;
    };

    Paging.prototype.setFirstPageNo = function(val) {
        this.firstPageNo = val;
    };

    Paging.prototype.getPrevPageNo = function() {
        return this.prevPageNo;
    };

    Paging.prototype.setPrevPageNo = function(val) {
        this.prevPageNo = val;
    };

    Paging.prototype.getStartPageNo = function() {
        return this.startPageNo;
    };

    Paging.prototype.setStartPageNo = function(val) {
        this.startPageNo = val;
    };

    Paging.prototype.getPageNo = function() {
        return this.pageNo;
    };

    Paging.prototype.setPageNo = function(val) {
        this.pageNo = val;
    };

    Paging.prototype.getEndPageNo = function() {
        return this.endPageNo;
    };

    Paging.prototype.setEndPageNo = function(val) {
        this.endPageNo = val;
    };

    Paging.prototype.getNextPageNo = function() {
        return this.nextPageNo;
    }

    Paging.prototype.setNextPageNo = function(val) {
        this.nextPageNo = val;
    };

    Paging.prototype.getFinalPageNo = function() {
        return this.finalPageNo;
    };

    Paging.prototype.setFinalPageNo = function(val) {
        this.finalPageNo = val;
    };

    Paging.prototype.setTotalCount = function(totalCount) {
        this.totalCount = totalCount;
        this.makePaging();
    };

    Paging.prototype.makePaging = function() {
        if (this.totalCount == 0) return; // 게시 글 전체 수가 없는 경우
        if (this.pageNo == 0) this.setPageNo(1); // 기본 값 설정
        if (this.pageSize == 0) this.setPageSize(3); // 기본 값 설정

        let finalPage = Math.floor((this.totalCount + (this.pageSize - 1)) / this.pageSize); // 마지막 페이지
        if (this.pageNo > finalPage) this.setPageNo(finalPage); // 기본 값 설정

        if (this.pageNo < 0 || this.pageNo > finalPage) this.pageNo = 1; // 현재 페이지 유효성 체크

        let isNowFirst = this.pageNo == 1 ? true : false; // 시작 페이지 (전체)
        let isNowFinal = this.pageNo == finalPage ? true : false; // 마지막 페이지 (전체)

        let startPage = Math.floor((this.pageNo - 1) / 3) * 3 + 1; // 시작 페이지 (페이징 네비 기준)
        let endPage = startPage + 3 - 1; // 끝 페이지 (페이징 네비 기준)

        if (endPage > finalPage) { // [마지막 페이지 (페이징 네비 기준) > 마지막 페이지] 보다 큰 경우
            endPage = finalPage;
        }

        this.setFirstPageNo(1); // 첫 번째 페이지 번호

        if (isNowFirst) {
            this.setPrevPageNo(1); // 이전 페이지 번호
        } else {
            this.setPrevPageNo(((this.pageNo - 1) < 1 ? 1 : (this.pageNo - 1))); // 이전 페이지 번호
        }

        this.setStartPageNo(startPage); // 시작 페이지 (페이징 네비 기준)
        this.setEndPageNo(endPage); // 끝 페이지 (페이징 네비 기준)

        if (isNowFinal) {
            this.setNextPageNo(finalPage); // 다음 페이지 번호
        } else {
            this.setNextPageNo(((this.pageNo + 1) > finalPage ? finalPage : (this.pageNo + 1))); // 다음 페이지 번호
        }this.setFinalPageNo(finalPage); // 마지막 페이지 번호
    };

    const pg = new Paging();

    let param = {}; // 전역변수로 지정

    $(document).ready(function(){
        pg.setPageNo(1);

        param = {
            inquireType: $("#inquireType").val(),
            searchType: $("#searchType").val(),
            searchData: $("#searchData").val()
        };

        searchData(param);
    });

    const onClickSearchData = function() {
        pg.setPageNo(1);

        param = {
            inquireType: $("#inquireType").val(),
            searchType: $("#searchType").val(),
            searchData: $("#searchData").val()
        };

        searchData(param);
    };

    const searchData = function(formData) {
        $.ajax({
            type: "POST",
            url: "/inquire/search.do",
            data: formData,
            success: function(res) {
                $(".inquire-search-cnt").empty();
                $(".inquire-search-cnt").append("총 " + res.length + "건");

                $("#search-result-field").empty();

                $("#paging-field").empty();
                if(res.length > 0) {
                    pg.setTotalCount(res.length);

                    let resultStr = "";
                    resultStr +=
                        '<colgroup>' +
                        '<col width="10%"><col width="10%"><col width="30%"><col width="20%"><col width="30%">' +
                        '</colgroup>' +
                        '<tr>' +
                        '<th class="search-result-head">No</th>' +
                        '<th class="search-result-head">문의 종류</th>' +
                        '<th class="search-result-head">제목</th>' +
                        '<th class="search-result-head">작성자</th>' +
                        '<th class="search-result-head">작성일</th>' +
                        '</tr>';


                    let i = pg.getPageNo() > 1 ? (pg.getPageNo() - 1) * pg.getPageSize() + 1 : 1;
                    let max = (pg.getPageNo() * pg.getPageSize()) > res.length ? res.length : pg.getPageNo() * pg.getPageSize();

                    for(const key in res) {
                        if(res[key].inquireNo == i && i <= max) {
                            resultStr +=
                                '<tr>'+
                                '<td class="search-result-data">' + res[key].inquireNo + '</td>' +
                                '<td class="search-result-data">' + res[key].inquireType + '</td>' +
                                '<td class="search-result-data"><a href="/inquire/view?idx=' + res[key].idx + '">' + res[key].inquireTitle + '</a></td>' +
                                '<td class="search-result-data">' + res[key].userName + '</td>' +
                                '<td class="search-result-data">' + res[key].regDate + '</td>' +
                                '</tr>';
                            i++;
                        }
                    }

                    let pagingStr = "";

                    pagingStr +=
                        '<nav id="paging-nav">' +
                        '<span class="paging-nav-arrow" onClick="onClickGoPage('+ pg.getFirstPageNo() +');">&lt;&lt;</span>' +
                        '<span class="paging-nav-arrow" onClick="onClickGoPage('+ pg.getPrevPageNo() +');">&lt;</span>';


                    for(let i = pg.getStartPageNo(); i <= pg.getEndPageNo(); i++) {
                        if(i == pg.getPageNo()) pagingStr += '<span class="paging-nav-number active">'+ i +'</span>';
                        else pagingStr += '<span class="paging-nav-number" onClick="onClickGoPage('+ i +');">'+ i +'</span>';
                    }

                    pagingStr +=
                        '<span class="paging-nav-arrow" onClick="onClickGoPage('+ pg.getNextPageNo() +');">&gt;</span>' +
                        '<span class="paging-nav-arrow" onClick="onClickGoPage('+ pg.getFinalPageNo() +');">&gt;&gt;</span></nav>';

                    $("#search-result-field").append(resultStr);
                    $("#paging-field").append(pagingStr);
                } else {
                    $("#search-result-field").append(
                        '<tr><th class="search-result-head">검색 결과가 존재하지 않습니다.</th></tr>'
                    );
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
                alert("통신 실패");
            }
        });
    };

    const onClickGoPage = function(page) {
        pg.setPageNo(page);

        searchData(param);
    };

    const onClickMoveForm = function() {
        location.href = "/inquire/form";
    };
</script>
</html>