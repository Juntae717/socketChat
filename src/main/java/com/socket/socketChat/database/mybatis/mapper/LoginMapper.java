package com.socket.socketChat.database.mybatis.mapper;

import com.socket.socketChat.database.mybatis.dto.LoginDTO;

public interface LoginMapper {
    LoginDTO loginDo(LoginDTO loginDTO);
}
