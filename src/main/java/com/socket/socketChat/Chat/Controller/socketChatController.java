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
import java.util.List;

@Controller
@RequiredArgsConstructor
public class socketChatController {

    private final socketChatService sockService;

    @RequestMapping("/")
    public String Login(HttpServletRequest request) { return sockService.Login(request); }

    @PostMapping("/login.do")
    @ResponseBody
    public String LoginDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.LoginDo(request, loginDTO); }

    @GetMapping("/logout.do")
    @ResponseBody
    public String LogoutDo(HttpServletRequest request) { return sockService.LogoutDo(request); }

    @RequestMapping("/signup")
    public String SignUp(HttpServletRequest request) { return sockService.SignUp(request); }

    @PostMapping("/signup.do")
    @ResponseBody
    public String SignUpDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.SignUpDo(request, loginDTO); }

    @GetMapping("/chat")
    public String Chat(HttpServletRequest request) { return sockService.Chat(request); }

    @PostMapping("/chat/ajax")
    @ResponseBody
    public String ChatAjax(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatAjax(request, chatDTO); }

    @GetMapping("/chat/statusAjax")
    @ResponseBody
    public List<ChatDTO> ChatSelectStatus(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatSelectStatus(request, chatDTO); }

    @PostMapping("/chat/logAjax")
    @ResponseBody
    public List<ChatDTO> ChatLog(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatLog(request, chatDTO); }
}
