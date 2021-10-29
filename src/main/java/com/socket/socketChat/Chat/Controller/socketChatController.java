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

/**
 * CLASS :: 클라이언트에서 들어온 URL을 매핑
 */
@Controller
@RequiredArgsConstructor
public class socketChatController {

    private final socketChatService sockService;

    /**
     * FUNCTION :: "/" URL로 클라이언트 접근 시 socketChatService Method Login 호출
     * @param request
     * @return
     */
    @RequestMapping("/")
    public String Login(HttpServletRequest request) { return sockService.Login(request); }

    /**
     * FUNCTION :: "/login.do" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method LoginDo 호출
     * @param request
     * @param loginDTO
     * @return
     */
    @PostMapping("/login.do")
    @ResponseBody
    public String LoginDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.LoginDo(request, loginDTO); }

    /**
     * FUNCTION :: "/logout.do" URL로 클라이언트에서 GET 형식으로 접근시 socketChatService Method LogoutDo 호출
     * @param request
     * @return
     */
    @GetMapping("/logout.do")
    @ResponseBody
    public String LogoutDo(HttpServletRequest request) { return sockService.LogoutDo(request); }

    /**
     * FUNCTION :: "/assign.do" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method AssignDo 호출
     * @param request
     * @param loginDTO
     * @return
     */
    @PostMapping("/assign.do")
    @ResponseBody
    public String AssignDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.AssignDo(request, loginDTO); }

    /**
     * FUNCTION :: "/release.do" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method ReleaseDo 호출
     * @param request
     * @param loginDTO
     * @return
     */
    @PostMapping("/release.do")
    @ResponseBody
    public String ReleaseDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.ReleaseDo(request, loginDTO); }

    /**
     * FUNCTION :: "/kick.do" URL로 클라이언트에서 접근시 socketChatService Method KickDo 호출
     * @param request
     * @return
     */
    @RequestMapping("/kick.do")
    public String KickDo(HttpServletRequest request) { return sockService.KickDo(request); }

    /**
     * FUNCTION :: "/ban.do" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method BanDo 호출
     * @param request
     * @param loginDTO
     * @return
     */
    @PostMapping("/ban.do")
    @ResponseBody
    public String BanDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.BanDo(request, loginDTO); }

    /**
     * FUNCTION :: "/pardon.do" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method PardonDo 호출
     * @param request
     * @param loginDTO
     * @return
     */
    @PostMapping("/pardon.do")
    @ResponseBody
    public String PardonDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.PardonDo(request, loginDTO); }

    /**
     * FUNCTION :: "/signup" URL로 클라이언트에서 접근시 socketChatService Method SignUp 호출
     * @param request
     * @return
     */
    @RequestMapping("/signup")
    public String SignUp(HttpServletRequest request) { return sockService.SignUp(request); }

    /**
     * FUNCTION :: "/signup.do" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method SignUpDo 호출
     * @param request
     * @param loginDTO
     * @return
     */
    @PostMapping("/signup.do")
    @ResponseBody
    public String SignUpDo(HttpServletRequest request, LoginDTO loginDTO) { return sockService.SignUpDo(request, loginDTO); }

    /**
     * FUNCTION :: "/chat" URL로 클라이언트에서 GET 형식으로 접근시 socketChatService Method Chat 호출
     * @param request
     * @return
     */
    @GetMapping("/chat")
    public String Chat(HttpServletRequest request) { return sockService.Chat(request); }

    /**
     * FUNCTION :: "/chat/ajax" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method ChatAjax 호출
     * @param request
     * @param chatDTO
     * @return
     */
    @PostMapping("/chat/ajax")
    @ResponseBody
    public String ChatAjax(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatAjax(request, chatDTO); }

    /**
     * FUNCTION :: "/chat/statusAjax" URL로 클라이언트에서 GET 형식으로 접근시 socketChatService Method ChatSelectStatus 호출
     * @param request
     * @param chatDTO
     * @return
     */
    @GetMapping("/chat/statusAjax")
    @ResponseBody
    public List<ChatDTO> ChatSelectStatus(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatSelectStatus(request, chatDTO); }

    /**
     * FUNCTION :: "/chat/logAjax" URL로 클라이언트에서 POST 형식으로 접근시 socketChatService Method ChatLog 호출
     * @param request
     * @param chatDTO
     * @return
     */
    @PostMapping("/chat/logAjax")
    @ResponseBody
    public List<ChatDTO> ChatLog(HttpServletRequest request, ChatDTO chatDTO) { return sockService.ChatLog(request, chatDTO); }
}
