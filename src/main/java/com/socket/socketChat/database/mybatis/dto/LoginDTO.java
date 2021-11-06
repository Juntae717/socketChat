package com.socket.socketChat.database.mybatis.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginDTO {
    private int idx; // 고유식별자
    private String userId; // 사용자 아이디
    private String userPwd; // 사용자 패스워드
    private String userName; // 사용자 이름
    private String userAccess; // 사용자 권한
}
