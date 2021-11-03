// LINE :: now date data
let todayDate = new Date();
// LINE :: format date data
let fmtTodayDate = todayDate.getFullYear() + "-" + ("00"+ (todayDate.getMonth() + 1)).slice(-2) + "-" + ("00" + todayDate.getDate()).slice(-2);


let userIdVal = null; // user id value to login info
let userNameVal = null; // user name value to login info
let userAccessVal = null; // user access value to login info

let ip = null; // user ip value
/**
 * FUNCTION :: Get client ip info
 */
$.getJSON("https://api.ipify.org?format=jsonp&callback=?",
    function(json) {
        ip = json.ip;
    }
);

let ws = null; // Web Socket Object info
$(document).ready(function (){
    userIdVal = $("#userId").val();
    userNameVal = $("#userName").val();
    userAccessVal = $("#userAccess").val();

    $("#userId").remove();
    $("#userName").remove();
    $("#userAccess").remove();

    /**
     * FUNCTION :: Web Socket Server Connect Request
     */
    function wsOpen() {
        ws = new WebSocket("ws://"+ location.host +"/socketChat");
        wsEvt();
    };

    wsOpen();

    /**
     * FUNCTION :: Web Socket Event Call Back
     */
    function wsEvt() {
        /**
         * FUNCTION :: Web Socket 연결 시 온라인/오프라인 유저 목록 동기화
         */
        ws.onopen = function() {
            synchronization();
        };

        /**
         * FUNCTION :: Web Socket Server에서 보낸 메시지 받기
         * @param data :: Web Socket Server에서 보낸 메시지 정보
         */
        ws.onmessage = function(data) {
            let msg = data.data;
            if((msg == "update" || msg == "connect" || msg == "disconnect") && msg.trim() != "") {
                synchronization();
            } else if(msg.substring(0, 19) == "/whisperCommandLine") {
                let tempArray = msg.split("&nbsp;");
                let whisperMsg = "";
                for(let i = 4; i < tempArray.length; i++) {
                    whisperMsg += tempArray[i];
                    if(i < tempArray.length - 1) {
                        whisperMsg += " ";
                    }
                }
                if(tempArray[1] == userIdVal) {
                    $("#chatting").append("<p style='color: blue'>" + tempArray[2] + " 님에게 보낸 귓속말: " + whisperMsg  + "</p>");
                    $("#chatting").scrollTop($("#chatting")[0].scrollHeight);
                }
                if(tempArray[2] == userIdVal) {
                    $("#chatting").append("<p style='color: blue'>" + tempArray[3] + " " + whisperMsg  + "</p>");
                    $("#chatting").scrollTop($("#chatting")[0].scrollHeight);
                }
            } else if(msg.substring(0, 20) == "/kickUserCommandLine" || msg.substring(0, 19) == "/banUserCommandLine") {
                let tempArray = msg.split("&nbsp;");
                if(tempArray[1] == userIdVal) {
                    location.replace("/kick.do");
                }
            } else if(msg.substring(0, 22) == "/pardonUserCommandLine") {
                //
            } else if(msg != null && msg.trim() != "") {
                $("#chatting").append("<p>" + msg + "</p>");
                $("#chatting").scrollTop($("#chatting")[0].scrollHeight);
            }
        };

        /**
         * FUNCTION :: Enter 입력 시 메시지 전송
         */
        $(document).on("keypress", function(e){
            if(e.keyCode == 13) {
                send();
            }
        });
    }
});

/**
 * FUNCTION :: 메시지 전송 시 DB서버와 Web Socket서버에 데이터를 보냄.
 * @returns {boolean}
 */
function send() {
    if($("#chatText").val() == "") {
        $("#chatText").focus();
        return false;
    }
    
    if($("#chatText").val() == "/로그아웃") {
        logout();
        return false;
    }

    let regNow = new Date();
    let param = {
        userId: userIdVal,
        userName: userNameVal,
        userIp: ip,
        msg: $("#chatText").val(),
        regDate: regNow.getFullYear() + "-" + ("00"+ (regNow.getMonth() + 1)).slice(-2) + "-" + ("00" + regNow.getDate()).slice(-2) + " "
        + ("00" + regNow.getHours()).slice(-2) + ":" + ("00" + regNow.getMinutes()).slice(-2) + ":" + ("00" + regNow.getSeconds()).slice(-2)
    }


    $.ajax({
        type: "POST",
        url: "/chat/ajax",
        data: param,
        success: function(res) {
            let msg = $("#chatText").val();
            ws.send(userNameVal + "(" + userIdVal + ")" + ": " + msg);
            $("#chatText").val("");
            $("#chatText").focus();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 온라인/오프라인 유저 목록 동기화, 권한에 따라 보여지는 메뉴 설정
 */
function synchronization() {
    $.ajax({
        type: "Get",
        url: "/chat/statusAjax",
        success: function(res) {
            $("#user-status").empty();

            for(let i = 0; i < res.length; i++) { if(res[i].userId == userIdVal) userAccessVal = res[i].userAccess; }

            for(let i = 0; i < res.length; i++) {
                if(res[i].userStatus == 1) { // user status online
                    if(userAccessVal == "300") { // user access 300
                        if(res[i].userId == userIdVal) {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
                        } else if(res[i].userAccess == "300") {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li></ul></li>');
                        } else if(res[i].userAccess == "200") {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li>'
                                + '<li onClick="ReleaseManager(`' + res[i].userId + '`);">관리자 해제</li></ul></li>');
                        } else if (res[i].userAccess == "100") {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li>'
                                + '<li onClick="AssignManager(`' + res[i].userId + '`);">관리자 지정</li>'
                                + '<li onClick="kickUser(`' + res[i].userId + '`);">내보내기</li>'
                                + '<li onClick="banUser(`' + res[i].userId + '`);">차단하기</li></ul></li>');
                        }
                    } else if(userAccessVal == "200") { // user access 200
                        if(res[i].userId == userIdVal) {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
                        } else if(res[i].userAccess == "300" || res[i].userAccess == "200") {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li></ul></li>');
                        } else if (res[i].userAccess == "100") {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li>'
                                + '<li onClick="kickUser(`' + res[i].userId + '`);">내보내기</li>'
                                + '<li onClick="banUser(`' + res[i].userId + '`);">차단하기</li></ul></li>');
                        }
                    } else if(userAccessVal == "100") { // user access 100
                        if(res[i].userId == userIdVal) {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')</li>');
                        } else {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li></ul></li>');
                        }
                    }
                } else { // user status offline
                    if(userAccessVal == "300") { // user access 200
                        if(res[i].userAccess == "300") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
                        } else if(res[i].userAccess == "200") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="ReleaseManager(`' + res[i].userId + '`);">관리자 해제</li></ul></li>');
                        } else if(res[i].userAccess == "100") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="AssignManager(`' + res[i].userId + '`);">관리자 지정</li>'
                                + '<li onClick="banUser(`' + res[i].userId + '`);">차단하기</li></ul></li>');
                        } else if(res[i].userAccess == "0") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="pardonUser(`' + res[i].userId + '`);">차단해제</li></ul></li>');
                        }
                    } else if(userAccessVal == "200") { // user access 200
                        if(res[i].userAccess == "300" || res[i].userAccess == "200") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
                        } else if(res[i].userAccess == "100") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="banUser(`' + res[i].userId + '`);">차단하기</li></ul></li>');
                        } else if(res[i].userAccess == "0") {
                            $("#user-status").append('<li class="user-status-list user-status-offline">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li>'
                                + '<li onClick="pardonUser(`' + res[i].userId + '`);">차단해제</li></ul></li>');
                        }
                    } else if(userAccessVal == "100") { // user access 100
                        $("#user-status").append('<li class="user-status-list user-status-offline">'
                            + '<span></span>' + res[i].userName + '(' + res[i].userId + ')' + '</li>');
                    }
                }
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 로그아웃 처리 기능
 */
function logout() {
    $.ajax({
        type: "GET",
        url: "/logout.do",
        success: function(res) {
            location.replace("/");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("통신 실패");
        }
    });
}

/**
 * FUNCTION :: 채팅 로그 검색 기능(레이어 팝업)
 * @param id :: 채팅 로그 조회 하려는 유저 아이디 정보
 * @param name :: 채팅 로그 조회 하려는 유저 이름 정보
 */
function popUpMenu(id, name) {
    $("body").append(
        '<div id="popUp-container">' +
            '<div id="popUpMenu">' +
                '<div id="close-btn" onClick="deletePopUp();"><span>X</span></div>' +
                '<div id="popUp-header">' +
                    '<h2 id="popUp-title">날짜 검색</h2>' +
                '</div>' +
                '<div id="popUp-content">' +
                    '<input id="searchDate" type="date" min="2021-01-01" max="'+ fmtTodayDate +'" value="'+ fmtTodayDate +'"/>' +
                    '<input type="button" value="채팅 로그 조회" onClick="popUpLog(`'+ id +'`, `'+ name +'`);"/>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

/**
 * FUNCTION :: 채팅 로그 조회 기능(레이어 팝업)
 * @param id :: 채팅 로그 조회 하려는 유저 아이디 정보
 * @param name :: 채팅 로그 조회 하려는 유저 이름 정보
 */
function popUpLog(id, name) {
    let param = {
        userId: id,
        searchDate: $("#searchDate").val()
    };
    deletePopUp();

    $.ajax({
        type: "POST",
        url: "/chat/logAjax",
        data: param,
        success: function(res) {
            let logList = "";
            let logText = name + '(' + id + ')' + '님의 채팅기록\n';
            let logFileName = id + "_" + param.searchDate.replaceAll("-", "");

            for(let i = 0; i < res.length; i++) {
                logList += '<li class="chat-log-list">[' + res[i].regTime + ']' + res[i].chatContent.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;") + '</li>';
                logText += '[' + res[i].regTime + ']' + res[i].chatContent + '\n';
            }

            logText = logText.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

            $("body").append(
                '<div id="popUp-container">' +
                    '<div id="popUpLog">' +
                        '<div id="close-btn" onclick="deletePopUp();">' +
                            '<span>X</span>' +
                        '</div>' +
                        '<div id="popUp-header">' +
                            '<h2 id="popUp-title">' + name + '(' + id + ')' + '님의 채팅기록</h2>' +
                            '<input type="button" value="다운로드" onClick="downloadLogFile(`'+ logFileName +'.txt`, `'+ logText +'`);">' +
                        '</div>' +
                        '<ul id="chat-log">' +
                            logList +
                        '</ul>' +
                    '</div>' +
                '</div>'
            );

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 조회한 로그 정보를 txt파일로 다운로드
 * @param filename :: txt 파일 이름 정보
 * @param text :: txt 파일에 들어갈 내용 정보
 */
function downloadLogFile(filename, text) {
    let fmtText = text.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&apos;", "'");
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fmtText));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

/**
 * FUNCTION :: 다운로드 한 채팅 로그 파일을 원하는 유저의 채팅 로그 기록에 백업하는 기능
 * @param id :: 채팅 로그 백업 하려는 유저 아이디 정보
 * @param name :: 채팅 로그 백업 하려는 유저 이름 정보
 */
function popUpBackUp(id, name) {
    $("body").append(
        '<div id="popUp-container">' +
            '<div id="popUpBackUp">' +
                '<div id="close-btn" onClick="deletePopUp();"><span>X</span></div>' +
                '<div id="popUp-header">' +
                    '<h2 id="popUp-title">채팅기록 백업</h2>' +
                '</div>' +
                '<div id="popUp-content">' +
                    '<div id="popUp-file">' +
                        '<input class="upload-name" value="파일선택" disabled="disabled">' +
                            '<label for="ex_filename">업로드</label>' +
                            '<input type="file" id="ex_filename" class="upload-hidden" onChange="fileTargetChange();">' +
                    '</div>' +
                    '<input type="button" value="백업하기" onclick="BackUpFile(`'+ id + '`, `' + name +'`)"/>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
};

/**
 * FUNCTION :: Input[type=file]에 입력된 파일 정보 변경 시 Label에 파일명 변경하여 삽입 하는 기능
 */
function fileTargetChange() {
    let filename = '';

    if(window.FileReader){
        filename = $('#popUp-file > .upload-hidden')[0].files[0].name;
    } else {
        filename = $('#popUp-file > .upload-hidden').val().split('/').pop().split('\\').pop();
    }

    $('#popUp-file > .upload-hidden').siblings('.upload-name').val(filename);
};

/**
 * FUNCTION :: 채틸 로그 백업 기능
 * @param id :: 채팅 로그 백업 하려는 유저 아이디 정보
 * @param name :: 채팅 로그 백업 하려는 유저 아이디 정보
 * @constructor
 */
function BackUpFile(id, name) {
    processFile($('#popUp-file > .upload-hidden')[0].files[0], id, name);
};

/**
 * FUNCTION :: 채팅 로그 백업 파일을 읽어서 DB 서버로 데이터 전송
 * @param file :: 채팅 로그 백업 하려는 파일 정보
 * @param id 채팅 로그 백업 하려는 유저 아이디 정보
 * @param name 채팅 로그 백업 하려는 유저 이름 정보
 * @returns {boolean}
 */
function processFile(file, id, name) {
    if (file == null) return false;

    let reader = new FileReader();
    reader.onload = function () {
        let tempArray = reader.result.split("\n");
        for(let i = 1; i < tempArray.length - 1; i++) {
            let param = {
                userId: id,
                userName: name,
                userIp: ip,
                msg: tempArray[i].substring(21),
                regDate: tempArray[i].substring(1, 20)
            };

            $.ajax({
                type: "POST",
                url: "/chat/ajax",
                data: param,
                success: function(res) {

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("통신 실패");
                }
            });
        }
        deletePopUp();
    };
    reader.readAsText(file, "UTF-8");
};

/**
 * FUNCTION :: 귓속말 기능(레이어 팝업)
 * @param id :: 귓속말을 전달받을 유저 아이디 정보
 * @param name 귓속말을 전달받을 유저 이름 정보
 */
function popUpWhisper(id, name) {
    $("body").append(
        '<div id="popUp-container">' +
            '<div id="popUpWhisper">' +
                '<div id="close-btn" onClick="deletePopUp();"><span>X</span></div>' +
                '<div id="popUp-header">' +
                    '<h2 id="popUp-title">' + id + '(' + name + ')님에게 귓속말 보내기</h2>' +
                '</div>' +
                '<div id="popUp-content">' +
                    '<input id="whisperText" type="text" placeholder="메시지 입력"/>' +
                    '<input type="button" value="보내기" onClick="whisper(`' + id + '`, `' + name + '`)"/>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
};

/**
 * FUNCTION :: Web Socket Server에 귓속말 전송
 * @param id :: 귓속말을 전달받을 유저 아이디 정보
 * @param name 귓속말을 전달받을 유저 이름 정보
 * @returns {boolean}
 */
function whisper(id, name) {
    if($("#whisperText").val() == "") {
        $("#whisperText").focus();
        return false;
    }

    let regNow = new Date();
    let param = {
        userId: userIdVal,
        userName: userNameVal,
        userIp: ip,
        msg: $("#whisperText").val(),
        regDate: regNow.getFullYear() + "-" + ("00"+ (regNow.getMonth() + 1)).slice(-2) + "-" + ("00" + regNow.getDate()).slice(-2) + " "
            + ("00" + regNow.getHours()).slice(-2) + ":" + ("00" + regNow.getMinutes()).slice(-2) + ":" + ("00" + regNow.getSeconds()).slice(-2)
    }


    $.ajax({
        type: "POST",
        url: "/chat/ajax",
        data: param,
        success: function(res) {
            let msg = $("#whisperText").val();
            ws.send("/whisperCommandLine" + " " + userIdVal + " " + id + " " + userNameVal + "(" + userIdVal + ")" + ": " + msg);
            $("#chatText").val("");
            $("#chatText").focus();
            deletePopUp();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 생성된 레이어 팝업을 없애는 기능
 */
function deletePopUp() {
    $("#popUp-container").remove();
};

/**
 * FUNCTION :: 관리자 권한 부여 기능
 * @param id :: 관리자 권한 부여할 유저 아이디 정보
 * @constructor
 */
function AssignManager(id) {
    let param = {
        userId: id
    };

    $.ajax({
        type: "POST",
        url: "/assign.do",
        data: param,
        success: function(res) {
            ws.send("update");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 관리자 권한 해제 기능
 * @param id :: 관리자 권한 해제할 유저 아이디 정보
 * @constructor
 */
function ReleaseManager(id) {
    let param = {
        userId: id
    };

    $.ajax({
        type: "POST",
        url: "/release.do",
        data: param,
        success: function(res) {
            ws.send("update");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 유저 내보내기 기능
 * @param id :: 내보낼 유저 아이디 정보
 */
function kickUser(id) {
    ws.send("/kickUserCommandLine" + " " + id);
    ws.send("update");
};

/**
 * FUNCTION :: 유저 차단 기능(서버 이용 불가능)
 * @param id :: 차단할 유저 아이디 정보
 */
function banUser(id) {
    let param = {
        userId: id
    }

    $.ajax({
        type: "POST",
        url: "/ban.do",
        data: param,
        success: function(res) {
            ws.send("/banUserCommandLine" + " " + id);
            ws.send("update");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 유저 차단 해제 기능
 * @param id :: 차단 해제할 유저 아이디 정보
 */
function pardonUser(id) {
    let param = {
        userId: id
    }

    $.ajax({
        type: "POST",
        url: "/pardon.do",
        data: param,
        success: function(res) {
            ws.send("/pardonUserCommandLine");
            ws.send("update");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};