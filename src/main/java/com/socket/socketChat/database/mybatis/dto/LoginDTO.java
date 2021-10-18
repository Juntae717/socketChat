package com.socket.socketChat.database.mybatis.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginDTO {
    private String userId;
    private String userPwd;
    private String userName;
}
