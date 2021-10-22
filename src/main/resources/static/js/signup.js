$.signup = function() {
    if($("#userId").val() == "") {
        alert("아이디가 입력되지 않았습니다.");
        $("#userId").focus();
        return false;
    } else if ($("#userName").val() == "") {
        alert("사용자 이름이 입력되지 않았습니다.");
        $("#userName").focus();
        return false;
    } else if ($("#userPwd").val() == "") {
        alert("비밀번호가 입력되지 않았습니다.");
        $("#userPwd").focus();
        return false;
    }

    if($("#userPwd").val() != $("#userPwdChk").val()) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }

    alert("정희수 원숭이 랄랄 그만");
    return false;

    const param = {
        userId: $("#userId").val(),
        userName: $("#userName").val(),
        userPwd: $("#userPwd").val()
    };

    $.ajax({
        type: "POST",
        url: "/signup.do",
        data: param,
        success: function(res) {
            if(res == "signup success") {
                alert("회원가입이 완료되었습니다.");
                location.href = "/";
            } else alert("이미 사용중인 아이디입니다.");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

$.moveLogin = function() {
    location.href = "/";
};