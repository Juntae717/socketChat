package com.socket.socketChat.database.mybatis.mapper;

import com.socket.socketChat.database.mybatis.dto.LoginDTO;

public interface LoginMapper {
    LoginDTO loginDo(LoginDTO loginDTO);
    LoginDTO SignUpChk(LoginDTO loginDTO);
    void SignUpDo(LoginDTO loginDTO);
    void AssignDo(LoginDTO loginDTO);
    void ReleaseDo(LoginDTO loginDTO);
    void BanDo(LoginDTO loginDTO);
    void PardonDo(LoginDTO loginDTO);
}
