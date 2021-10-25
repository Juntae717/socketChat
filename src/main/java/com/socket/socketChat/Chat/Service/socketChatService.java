package com.socket.socketChat.Chat.Service;

import com.socket.socketChat.Chat.Config.SessionConfig;
import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import com.socket.socketChat.database.mybatis.mapper.ChatMapper;
import com.socket.socketChat.database.mybatis.mapper.LoginMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import javax.servlet.annotation.WebListener;
import javax.servlet.http.*;
import java.util.HashMap;
import java.util.List;


@Service
@RequiredArgsConstructor
@WebListener
public class socketChatService {


    private final ChatMapper chatMapper;
    private final LoginMapper loginMapper;
    private final SessionConfig sessionConfig;

    public String Login(HttpServletRequest request) {
        HttpSession session = request.getSession();

        if(session.getAttribute("loginInfo") != null) {
            return "redirect:/chat";
        } else {
            return "/login";
        }
    }

    public String LoginDo(HttpServletRequest request, LoginDTO loginDTO) {
        if(loginMapper.loginDo(loginDTO) == null) {
            return "login fail";
        } else if(loginMapper.loginDo(loginDTO).getUserAccess().equals("0")) {
            return "user banned";
        } else if(sessionConfig.SessionIdCheck(loginMapper.loginDo(loginDTO).getUserId()).equals("chk")) {
            return "duplicate login";
        } else {
            HttpSession session = request.getSession();
            session.setAttribute("loginInfo", loginMapper.loginDo(loginDTO));
            return "login success";
        }
    }

    public String LogoutDo(HttpServletRequest request) {
        HttpSession session = request.getSession();

        session.removeAttribute("loginInfo");
        session.invalidate();
        return "success";
    }

    public String KickDo(HttpServletRequest request) {
        HttpSession session = request.getSession();

        session.removeAttribute("loginInfo");
        session.invalidate();
        return "redirect:";
    }

    public String AssignDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.AssignDo(loginDTO);
        return "success";
    }

    public String ReleaseDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.ReleaseDo(loginDTO);
        return "success";
    }

    public String BanDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.BanDo(loginDTO);
        return "success";
    }

    public String PardonDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.PardonDo(loginDTO);
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
