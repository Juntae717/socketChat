package com.socket.socketChat.Chat.Config;

import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import org.springframework.stereotype.Component;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.*;
import java.util.HashMap;

@Component
@WebListener
public class SessionConfig implements HttpSessionListener, HttpSessionAttributeListener {

    HashMap<String, HttpSession> sessionMap = new HashMap<>();

    public synchronized String SessionIdCheck(String id) {
        for(String key: sessionMap.keySet()) {
            HttpSession hs = sessionMap.get(key);
            LoginDTO loginDTO = (LoginDTO) hs.getAttribute("loginInfo");
            if (loginDTO.getUserId().equals(id)) return "chk";
        }

        return "";
    }

    @Override
    public void attributeAdded(HttpSessionBindingEvent se) {
        // 프라퍼티 추가시 호출
        sessionMap.put(se.getSession().getId(), se.getSession());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        // 세션 소멸시 호출
        if(sessionMap.get(se.getSession().getId()) != null){
            sessionMap.get(se.getSession().getId()).invalidate();
            sessionMap.remove(se.getSession().getId());
        }
    }
}