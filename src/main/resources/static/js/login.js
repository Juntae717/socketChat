$.login = function() {
    const param = {
        userId: $("#userId").val(),
        userPwd: $("#userPwd").val()
    };

    $.ajax({
        type: "POST",
        url: "/login.do",
        data: param,
        success: function(res) {
            if(res == "login success") location.replace("/chat");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

$.moveSignUp = function() {
    location.href = "/signup";
};