let todayDate = new Date();
let fmtTodayDate = todayDate.getFullYear() + "-" + ("00"+ (todayDate.getMonth() + 1)).slice(-2) + "-" + ("00" + todayDate.getDate()).slice(-2);

let ip = null;
$.getJSON("https://api.ipify.org?format=jsonp&callback=?",
    function(json) {
        ip = json.ip;
    }
);

let ws = null;
$(document).ready(function (){
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
                ws.send("sendId=" + $("#userId").val());
                window.setTimeout(synchronization, 100);
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
        userId: $("#userId").val(),
        userName: $("#userName").val(),
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
            ws.send("[" + regNow.getFullYear() + "-" + ("00"+ (regNow.getMonth() + 1)).slice(-2) + "-" + ("00" + regNow.getDate()).slice(-2) + " "
                + ("00" + regNow.getHours()).slice(-2) + ":" + ("00" + regNow.getMinutes()).slice(-2) + ":" + ("00" + regNow.getSeconds()).slice(-2) + "]"
                + " " + $("#userName").val() + "(" + $("#userId").val() + ")" + "님이 보낸 메시지" + "\n" + msg);
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
                    $("#user-status").append('<li class="user-status-list user-status-online">'
                        + '<span></span>' + res[i].userName + '(' + res[i].userId + ')' + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li><li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
                } else {
                    $("#user-status").append('<li class="user-status-list user-status-offline">'
                        + '<span></span>' + res[i].userName + '(' + res[i].userId + ')' + '<ul class="user-log-menu"><li onClick="popUpMenu(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</li><li onClick="popUpBackUp(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 백업</li></ul></li>');
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
                logList += '<li class="chat-log-list">[' + res[i].regTime + ']' + res[i].chatContent + '</li>';
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
                    console.log(res);
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

function deletePopUp() {
    $("#popUp-container").remove();
};