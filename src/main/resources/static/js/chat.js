let todayDate = new Date();
let fmtTodayDate = todayDate.getFullYear() + "-" + ("00"+ (todayDate.getMonth() + 1)).slice(-2) + "-" + ("00" + todayDate.getDate()).slice(-2);

let userIdVal = null;
let userNameVal = null;
let userAccessVal = null;

let ip = null;
$.getJSON("https://api.ipify.org?format=jsonp&callback=?",
    function(json) {
        ip = json.ip;
    }
);

let ws = null;
$(document).ready(function (){
    userIdVal = $("#userId").val();
    userNameVal = $("#userName").val();
    userAccessVal = $("#userAccess").val();

    $("#chatting").scrollTop($("#chatting")[0].scrollHeight);

    function wsOpen() {
        ws = new WebSocket("ws://"+ location.host +"/socketChat");
        wsEvt();
    };

    wsOpen();

    function wsEvt() {
        ws.onopen = function() {
            synchronization();
        };

        ws.onmessage = function(data) {
            let msg = data.data;
            if((msg == "connect" || msg == "disconnect") && msg.trim() != "") {
                ws.send("sendId=" + userIdVal);
                window.setTimeout(synchronization, 100);
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
                // refresh
            } else if(msg != null && msg.trim() != "") {
                $("#chatting").append("<p>" + msg + "</p>");
                $("#chatting").scrollTop($("#chatting")[0].scrollHeight);
            }
        };

        $(document).on("keypress", function(e){
            if(e.keyCode == 13) {
                send();
            }
        });
    }
});

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

function synchronization() {
    $.ajax({
        type: "Get",
        url: "/chat/statusAjax",
        success: function(res) {
            $("#user-status").empty();

            for(let i = 0; i < res.length; i++) {
                if(res[i].userStatus == 1) {
                    if(userAccessVal == "200") {
                        if(res[i].userId == userIdVal) {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li>'
                                + '<li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
                        } else if(res[i].userAccess == "200") {
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
                    } else if(userAccessVal == "100") {
                        if(res[i].userId == userIdVal) {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')</li>');
                        } else {
                            $("#user-status").append('<li class="user-status-list user-status-online">'
                                + '<span></span>' + res[i].userName + '(' + res[i].userId + ')'
                                + '<ul class="user-log-menu"><li onClick="popUpWhisper(`' + res[i].userId + '`, `' + res[i].userName + '`);">귓속말</li></ul></li>');
                        }
                    }
                } else {
                    if(userAccessVal == "200") {
                        if(res[i].userAccess == "200") {
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
                    } else if(userAccessVal == "100") {
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

function fileTargetChange() {
    let filename = '';

    if(window.FileReader){
        filename = $('#popUp-file > .upload-hidden')[0].files[0].name;
    } else {
        filename = $('#popUp-file > .upload-hidden').val().split('/').pop().split('\\').pop();
    }

    $('#popUp-file > .upload-hidden').siblings('.upload-name').val(filename);
};

function BackUpFile(id, name) {
    processFile($('#popUp-file > .upload-hidden')[0].files[0], id, name);
};

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

function deletePopUp() {
    $("#popUp-container").remove();
};

function kickUser(id) {
    ws.send("/kickUserCommandLine" + " " + id);
};

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
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

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
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};