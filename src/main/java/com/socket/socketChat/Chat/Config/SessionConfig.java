package com.socket.socketChat.Chat.Config;

import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import org.springframework.stereotype.Component;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.*;
import java.util.HashMap;

@Component
@WebListener
public class SessionConfig implements HttpSessionListener, HttpSessionAttributeListener {

    /**
     * LINE :: 로그인 세션을 담아둘 맵
     */
    HashMap<String, HttpSession> sessionMap = new HashMap<>();

    /**
     * FUNCTION :: 세션을 담아둔 맵에 로그인 시도한 아이디가 중복되는지 체크
     * @param id
     * @return
     */
    public synchronized String SessionIdCheck(String id) {
        for(String key: sessionMap.keySet()) {
            HttpSession hs = sessionMap.get(key);
            LoginDTO loginDTO = (LoginDTO) hs.getAttribute("loginInfo");
            if (loginDTO.getUserId().equals(id)) return "chk";
        }

        return "";
    }

    /**
     * FUNCTION :: 로그인 세션 속성 추가 시(로그인 성공) 해당 세션 값 맵에 넣음
     * @param se
     */
    @Override
    public void attributeAdded(HttpSessionBindingEvent se) {
        sessionMap.put(se.getSession().getId(), se.getSession());
    }

    /**
     * FUNCTION :: 로그인 세션 소멸시 해당 세션 맵에서 제거
     * @param se
     */
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        // 세션 소멸시 호출
        if(sessionMap.get(se.getSession().getId()) != null){
            sessionMap.get(se.getSession().getId()).invalidate();
            sessionMap.remove(se.getSession().getId());
        }
    }
}