$(document).ready(function(){
    /**
     * LINE :: 사용자 아이디 설정
     */

    /**
     * FUNCTION :: editor custom settings
     */
    $('.summernote').summernote({
        width: 500,
        height: 400,
        lang: "ko-KR",
        toolbar: [
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['color', ['forecolor','color']],
            ['table', ['table']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['insert',['picture','link','video']]
        ],
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','맑은 고딕','궁서','굴림체','굴림','돋움체','바탕체'],
        fontSizes: ['8','9','10','11','12','13','14','16','18','20','24','30','36']
    });
});

/**
 * FUNCTION :: mail domain 키 입력 갑지 후 select box 값 초기화
 */
const onKeydowninquireMailDomain = function() {
    $("#select-box").find("option:eq(0)").prop("selected", true);
};

/**
 * FUNCTION :: select box 값 변경 이벤트 감지 후 메일 도메인 부분 변경
 * @param element
 */
const onChangeSelectBox = function(element) {
    $("#inquireMailDomain").val($("#"+element.id).val());
};

/**
 * FUNCTION :: 등록 버튼 클릭 시
 */
const onClickSave = function() {
    const inquireTypeList = document.getElementsByName('inquireType'); // 문의 종류 radio 버튼 리스트
    let inquireTypeVal = ""; // 문의 종류 값
    let inquireMailVal = $("#inquireMailName").val() + "@" + $("#inquireMailDomain").val(); // 이메일 값

    /**
     * LINE :: 선택된 radio 값 설정
     */
    inquireTypeList.forEach((v) => {
        if(v.checked) inquireTypeVal = v.value;
    });

    /**
     * LINE :: AJAX 통신에 사용될 파라미터
     * @type {{inquireType: string, inquireContent: (*|jQuery), inquireTitle: (*|jQuery), userId: string, inquireMail: string}}
     */
    let param = {
        userId: '0588',
        inquireType: inquireTypeVal,
        inquireTitle: $("#inquireTitle").val(),
        inquireMail: inquireMailVal,
        inquireContent: $(".note-editable").html()
    };

    validationCheck(param); // 유효성 검사
};

/**
 * FUNCTION :: 유효성 검사
 * @param object
 */
const validationCheck = function(object) {
    let emailExpText = /^([a-zA-Z0-9_\-]+)@([a-zA-Z0-9\-]+)(\.[a-zA-Z0-9\-]+){1,2}$/;

    for(const key in object) {
        if(object[key] == "") {
            alert($("#"+key+"-label").html() + "의 값이 입력되지 않았습니다.");
            return false;
        } else if(key == "inquireMail") { // 이메일 유효성 검사
            if(!(emailExpText.test(object[key]))) {
                alert($("#"+key+"-label").html() + "의 형식이 올바르지 않습니다.");
                return false;
            }
        } else if(key == "inquireContent") { // Summernote 유효성 검사
            if($(".summernote").summernote('isEmpty')) {
                alert($("#"+key+"-label").html() + "의 값이 입력되지 않았습니다.");
                return false;
            }
        }
    }
    SendMail(object);
};


/**
 * FUNCTION :: 문의 메일 발송
 */
const SendMail = function(formData) {
    let param = {
        address: formData.inquireMail,
        title: "문의 메일 발송 안내",
        message: formData.inquireContent
    }

    $.ajax({
        type: "POST",
        url: "/inquire/form/mail.do",
        data: param,
        success: function(res) {
            SaveData(formData);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};

/**
 * FUNCTION :: 문의 내용 DB 서버 저장
 */
const SaveData = function(formData) {
    $.ajax({
        type: "POST",
        url: "/inquire/form/save.do",
        data: formData,
        success: function(res) {
            location.replace("/inquire");
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            alert("통신 실패");
        }
    });
};


/**
 * FUNCTION :: 문의 목록 이동
 */
const onClickMoveList = function() {
    location.href = "/inquire";
};