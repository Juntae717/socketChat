package com.socket.socketChat.database.mybatis.mapper;

import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {
    void insertChatLog(ChatDTO chatDTO);
}
