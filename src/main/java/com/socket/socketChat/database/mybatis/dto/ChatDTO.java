package com.socket.socketChat.database.mybatis.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChatDTO {
    private String userId; // 사용자 아이디
    private String userName; // 사용자 이름
    private String userIp; // 클라이언트 ip
    private int userStatus; // 사용자 온라인/오프라인 상태
    private String chatContent; // 데이터베이스 메시지 정보
    private String msg; // 클라이언트 메시지 전달 정보
    private String regDate; // 메시지 입력 날짜
    private String regTime; // 메시지 입력 시간
    private String searchDate; // 검색 조건 날짜
    private String userAccess; // 유저 권한
}
