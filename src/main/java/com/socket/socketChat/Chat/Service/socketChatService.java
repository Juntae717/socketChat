package com.socket.socketChat.Chat.Service;

import com.socket.socketChat.Chat.Config.SessionConfig;
import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import com.socket.socketChat.database.mybatis.dto.MenuDTO;
import com.socket.socketChat.database.mybatis.mapper.ChatMapper;
import com.socket.socketChat.database.mybatis.mapper.LoginMapper;
import com.socket.socketChat.database.mybatis.mapper.MenuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.*;
import java.util.List;


@Service
@RequiredArgsConstructor
public class socketChatService {
    
    private final ChatMapper chatMapper;
    private final LoginMapper loginMapper;
    private final MenuMapper menuMapper;
    private final SessionConfig sessionConfig;

    /**
     * FUNCTION :: 로그인 정보가 있을 시 페이지 이동 없을 시 로그인 페이지 반환
     * @param request
     * @return
     */
    public String Login(HttpServletRequest request) {
        HttpSession session = request.getSession();

        if(session.getAttribute("loginInfo") != null) {
            return "redirect:/chat";
        } else {
            return "/login";
        }
    }

    /**
     * FUNCTION :: 로그인 기능(로그인 정보 조회, 차단 여부, 중복 로그인 여부 확인)
     * @param request
     * @param loginDTO
     * @return
     */
    public String LoginDo(HttpServletRequest request, LoginDTO loginDTO) {
        if(loginMapper.selectLoginDo(loginDTO) == null) {
            return "login fail";
        } else if(loginMapper.selectLoginDo(loginDTO).getUserAccess().equals("0")) {
            return "user banned";
        } else if(sessionConfig.SessionIdCheck(loginMapper.selectLoginDo(loginDTO).getUserId()).equals("chk")) {
            return "duplicate login";
        } else {
            HttpSession session = request.getSession();
            session.setAttribute("loginInfo", loginMapper.selectLoginDo(loginDTO));
            return "login success";
        }
    }

    /**
     * FUNCTION :: 로그아웃 기능
     * @param request
     * @return
     */
    public String LogoutDo(HttpServletRequest request) {
        HttpSession session = request.getSession();

        session.removeAttribute("loginInfo");
        session.invalidate();
        return "success";
    }

    /**
     * FUNCTION :: 사용자 내보내기 기능
     * @param request
     * @return
     */
    public String KickDo(HttpServletRequest request) {
        HttpSession session = request.getSession();

        session.removeAttribute("loginInfo");
        session.invalidate();
        return "redirect:";
    }

    /**
     * FUNCTION :: 관리자 권한 부여
     * @param request
     * @param loginDTO
     * @return
     */
    public String AssignDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.updateAssignDo(loginDTO);
        return "success";
    }

    /**
     * FUNCTION :: 관리자 권한 해제
     * @param request
     * @param loginDTO
     * @return
     */
    public String ReleaseDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.updateReleaseDo(loginDTO);
        return "success";
    }

    /**
     * FUNCTION :: 사용자 차단
     * @param request
     * @param loginDTO
     * @return
     */
    public String BanDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.updateBanDo(loginDTO);
        return "success";
    }

    /**
     * FUNCTION :: 사용자 차단해제
     * @param request
     * @param loginDTO
     * @return
     */
    public String PardonDo(HttpServletRequest request, LoginDTO loginDTO) {
        loginMapper.updatePardonDo(loginDTO);
        return "success";
    }

    /**
     * FUNCTION :: 회원가입 페이지 반환
     * @param request
     * @return
     */
    public String SignUp(HttpServletRequest request) {
        HttpSession session = request.getSession();

        if(session.getAttribute("loginInfo") != null) {
            return "redirect:/chat";
        } else {
            return "/signup";
        }
    }

    /**
     * FUNCTION :: 회원가입 정보 DB에 입력
     * @param request
     * @param loginDTO
     * @return
     */
    public String SignUpDo(HttpServletRequest request, LoginDTO loginDTO) {
        if(loginMapper.selectSignUpChk(loginDTO) == null) {
            loginMapper.insertSignUpDo(loginDTO);
            return "signup success";
        } else {
            return "signup fail";
        }
    }

    /**
     * FUNCTION :: 채팅 페이지 반환
     * @param request
     * @return
     */
    public String Chat(HttpServletRequest request) { return "/chat/chat"; }

    /**
     * FUNCTION :: 채팅 로그 데이터 입력
     * @param request
     * @param chatDTO
     * @return
     */
    public String ChatAjax(HttpServletRequest request, ChatDTO chatDTO) {
        chatMapper.insertChatLog(chatDTO);
        return "success";
    }

    /**
     * FUNCTION :: 온라인/오프라인 유저 정보 조회
     * @param request
     * @param chatDTO
     * @return
     */
    public List<ChatDTO> ChatSelectStatus(HttpServletRequest request, ChatDTO chatDTO) {
        List<ChatDTO> data = chatMapper.selectStatus();

        return data;
    }

    /**
     * FUNCTION :: 채팅 로그 데이터 조회
     * @param request
     * @param chatDTO
     * @return
     */
    public List<ChatDTO> ChatLog(HttpServletRequest request, ChatDTO chatDTO) {
        List<ChatDTO> data = chatMapper.selectChatLog(chatDTO);

        return data;
    }

    public List<MenuDTO> LoadMenu(HttpServletRequest request, MenuDTO menuDTO) {
        return menuMapper.selectMenu(menuDTO);
    }
}