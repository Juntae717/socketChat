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
                        + '<span></span>' + res[i].userName + '(' + res[i].userId + ')' + '<div class="user-log-menu" onClick="chatLog(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</div></li>');
                } else {
                    $("#user-status").append('<li class="user-status-list user-status-offline">'
                        + '<span></span>' + res[i].userName + '(' + res[i].userId + ')' + '<div class="user-log-menu" onClick="chatLog(`' + res[i].userId + '`, `' + res[i].userName + '`);">채팅기록 조회</div></li>');
                }
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

function chatLog(id, name) {
    let param = {
        userId: id
    }

    $.ajax({
        type: "POST",
        url: "/chat/logAjax",
        data: param,
        success: function(res) {
            let logList = "";
            for(let i = 0; i < res.length; i++) {
                logList += '<li class="chat-log-list">[' + res[i].regTime + ']' + res[i].chatContent + '</li>';
            }
            $("body").append(
                '<div id="popUp-container">' +
                    '<div id="popUp">' +
                        '<div id="close-btn" onclick="deletePopUp();">' +
                            '<span>X</span>' +
                        '</div>' +
                        '<h2 id="chat-log-title">' + name + '(' + id + ')' + '님의 채팅기록</h2>' +
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

function deletePopUp() {
    $("#popUp-container").remove();
};