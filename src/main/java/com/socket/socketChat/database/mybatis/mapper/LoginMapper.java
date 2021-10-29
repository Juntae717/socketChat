package com.socket.socketChat.database.mybatis.mapper;

import com.socket.socketChat.database.mybatis.dto.LoginDTO;

public interface LoginMapper {
    /**
     * FUNCTION :: 로그인 정보 조회
     * @param loginDTO
     * @return
     */
    LoginDTO selectLoginDo(LoginDTO loginDTO);

    /**
     * FUNCTION :: 회원가입 아이디 중복체크
     * @param loginDTO
     * @return
     */
    LoginDTO selectSignUpChk(LoginDTO loginDTO);

    /**
     * FUNCTION :: 회원가입 정보 입력
     * @param loginDTO
     */
    void insertSignUpDo(LoginDTO loginDTO);

    /**
     * FUNCTION :: 관리자 권한 부여
     * @param loginDTO
     */
    void updateAssignDo(LoginDTO loginDTO);

    /**
     * FUNCTION :: 관리자 권한 해제
     * @param loginDTO
     */
    void updateReleaseDo(LoginDTO loginDTO);

    /**
     * FUNCTION :: 사용자 차단
     * @param loginDTO
     */
    void updateBanDo(LoginDTO loginDTO);

    /**
     * FUNCITON :: 사용자 차단 해제
     * @param loginDTO
     */
    void updatePardonDo(LoginDTO loginDTO);
}
