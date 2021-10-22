package com.socket.socketChat.Chat.Service;

import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import com.socket.socketChat.database.mybatis.mapper.ChatMapper;
import com.socket.socketChat.database.mybatis.mapper.LoginMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;


@Service
@RequiredArgsConstructor
public class socketChatService {
    private final ChatMapper chatMapper;
    private final LoginMapper loginMapper;

    public String Login(HttpServletRequest request) {
        HttpSession session = request.getSession();

        if(session.getAttribute("loginInfo") != null) {
            return "redirect:/chat";
        } else {
            return "/login";
        }
    }

    public String LoginDo(HttpServletRequest request, LoginDTO loginDTO) {
        HttpSession session = request.getSession();

        if(loginMapper.loginDo(loginDTO) == null) {
            return "login fail";
        } else {
            session.setAttribute("loginInfo", loginMapper.loginDo(loginDTO));
            return "login success";
        }
    }

    public String LogoutDo(HttpServletRequest request) {
        HttpSession session = request.getSession();

        session.removeAttribute("loginInfo");
        return "success";
    }

    public String SignUp(HttpServletRequest request) {
        HttpSession session = request.getSession();

        if(session.getAttribute("loginInfo") != null) {
            return "redirect:/chat";
        } else {
            return "/signup";
        }
    }

    public String SignUpDo(HttpServletRequest request, LoginDTO loginDTO) {
        if(loginMapper.SignUpChk(loginDTO) == null) {
            loginMapper.SignUpDo(loginDTO);
            return "signup success";
        } else {
            return "signup fail";
        }
    }


    public String Chat(HttpServletRequest request) { return "/chat"; }

    public String ChatAjax(HttpServletRequest request, ChatDTO chatDTO) {
        chatMapper.insertChatLog(chatDTO);
        return "success";
    }

    public List<ChatDTO> ChatSelectStatus(HttpServletRequest request, ChatDTO chatDTO) {
        List<ChatDTO> data = chatMapper.selectStatus();

        return data;
    }

    public List<ChatDTO> ChatLog(HttpServletRequest request, ChatDTO chatDTO) {
        List<ChatDTO> data = chatMapper.selectChatLog(chatDTO);

        return data;
    }
}
