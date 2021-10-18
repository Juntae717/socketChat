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

    public String SignUp(HttpServletRequest request) {
        HttpSession session = request.getSession();

        if(session.getAttribute("loginInfo") != null) {
            return "redirect:/chat";
        } else {
            return "/signup";
        }
    }


    public String Chat(HttpServletRequest request) { return "/chat"; }

    public String ChatAjax(HttpServletRequest request, ChatDTO chatDTO) {
        chatMapper.insertChatLog(chatDTO);
        return "seccess";
    }
}
