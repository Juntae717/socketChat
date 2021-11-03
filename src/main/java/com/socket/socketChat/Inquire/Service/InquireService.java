package com.socket.socketChat.Inquire.Service;

import com.socket.socketChat.database.mybatis.dto.InquireDTO;
import com.socket.socketChat.database.mybatis.mapper.InquireMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InquireService {
    private final InquireMapper inquireMapper;

    public List<InquireDTO> searchInquireData(InquireDTO inquireDTO) {
        return inquireMapper.searchInquireData(inquireDTO);
    }

    public String saveInquireData(InquireDTO inquireDTO) {
        inquireMapper.insertInquireData(inquireDTO);

        return "seccess";
    }

    public InquireDTO getInquireDataByIdx(InquireDTO inquireDTO) {
        return inquireMapper.selectInquireDataByIdx(inquireDTO);
    }
}
