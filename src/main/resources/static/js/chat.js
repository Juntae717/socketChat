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
        };

        ws.onmessage = function(data) {
            let msg = data.data;
            if((msg == "connect" || msg == "disconnect") && msg.trim() != "") {
                ws.send("sendId=" + $("#userId").val());
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

function send(){
    if($("#chatText").val() == "") return false;

    let regNow = new Date();
    let param = {
        userId: $("#userId").val(),
        userName: $("#userName").val(),
        userIp: ip,
        msg: $("#chatText").val(),
        regDate: regNow
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
            $('#chatText').val("");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};