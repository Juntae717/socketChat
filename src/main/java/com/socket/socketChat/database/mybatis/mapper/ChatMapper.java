package com.socket.socketChat.database.mybatis.mapper;

import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {
    /**
     * FUNCTION :: 채팅 로그 데이터 입력
     * @param chatDTO
     */
    void insertChatLog(ChatDTO chatDTO);

    /**
     * FUNCTION :: 오프라인 유저 온라인으로 상태 변경
     * @param chatDTO
     */
    void updateStatus(ChatDTO chatDTO);

    /**
     * FUNCTION :: 모든 유저 오프라인 상태로 초기화
     */
    void resetStatus();

    /**
     * FUNCTION :: 유저 정보 및 온라인/오프라인 상태 조회
     * @return
     */
    List<ChatDTO> selectStatus();

    /**
     * FUNCTION :: 채팅 로그 조회
     * @param chatDTO
     * @return
     */
    List<ChatDTO> selectChatLog(ChatDTO chatDTO);
}
