package com.socket.socketChat.database.mybatis.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter @Setter
public class InquireDTO {
    private int idx; // 고유식별자
    private int inquireIdx; // 문의 고유식별자(답변 기능)
    private int inquireNo; // 문의 글 순서
    private String userIdx; // 작성자 고유식별자
    private String userId; // 작성자 아이디
    private String userName; // 작성자 이름
    private Date regDate; // 작성 일자
    private String inquireType; // 문의 종류
    private String inquireTitle; // 문의 제목
    private String inquireMail; // 문의 메일
    private String inquireContent; // 문의 내용
    private char replyChk;  // 답변 상태
    
    private String searchType; // 검색 조건
    private String searchData; // 검색 값

    private String replyTitle; // 답변 제목
    private String replyContent; // 답변 내용
}
