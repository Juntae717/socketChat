package com.socket.socketChat.Chat.Controller;

import com.socket.socketChat.Chat.Service.socketChatService;
import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequiredArgsConstructor
public class socketChatController {

    private final socketChatService sockService;

    @RequestMapping("/")
    public String Login(HttpServletRequest request) { return sockService.Login(request); }

    @PostMapping("/login.do")
    @ResponseBody
    public String LoginDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.LoginDo(request, loginDTO); }

    @RequestMapping("/signup")
    public String SignUp(HttpServletRequest request) { return sockService.SignUp(request); }

    @GetMapping("/chat")
    public String Chat(HttpServletRequest request) { return sockService.Chat(request); }

    @PostMapping("/chat/ajax")
    @ResponseBody
    public String ChatAjax(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatAjax(request, chatDTO); }
}
