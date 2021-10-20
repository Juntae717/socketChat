package com.socket.socketChat.database.mybatis.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter @Setter
public class ChatDTO {
    private String userId;
    private String userName;
    private String userIp;
    private int userStatus;
    private String chatContent;
    private String msg;
    private String regDate;
    private String regTime;
}
