package com.socket.socketChat.database.mybatis.mapper;

import com.socket.socketChat.database.mybatis.dto.InquireDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface InquireMapper {
    void insertInquireData(InquireDTO inquireDTO);
    List<InquireDTO> searchInquireData(InquireDTO inquireDTO);
    InquireDTO selectInquireDataByIdx(InquireDTO inquireDTO);

}
