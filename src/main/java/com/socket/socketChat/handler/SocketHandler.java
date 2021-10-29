package com.socket.socketChat.handler;

import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import com.socket.socketChat.database.mybatis.dto.LoginDTO;
import com.socket.socketChat.database.mybatis.mapper.ChatMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


import java.util.HashMap;

@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {
    private final ChatMapper chatMapper;

    /**
     * LINE :: 웹소켓 세션을 담아둘 맵
     */
    HashMap<String, WebSocketSession> sessionMap = new HashMap<>();
    HashMap<WebSocketSession, String> userMap = new HashMap<>();

    /**
     * FUNCTION :: 클라이언트에서 보낸 메시지를 받아서 가공(XSS 공격 방지) 혹은 DB접근(ID 값으로 온라인 상태 변경) 후 
     * 클라이언트로 메시지 전달
     * @param session
     * @param message
     */
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        //메시지 발송
        String msg = message.getPayload();

        if(msg == "update") {
            chatMapper.resetStatus();
        } else {
            msg = msg.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
                    .replace("'", "&apos;").replace("\\", "&#x2F;").replace(" ", "&nbsp;").replace("\n", "<br/>");
        }
        for (String key : sessionMap.keySet()) {
            WebSocketSession wss = sessionMap.get(key);
            if(wss != null && wss.isOpen()) {
                try {
                    synchronized (wss) {
                        wss.sendMessage(new TextMessage(msg));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

    /**
     * FUNCTION :: 클라이언트에서 소켓 연결시 해당 세션 맵에 넣은 후 클라이언트로 연결 메시지 클라이언트로 전달(온라인 상태 변경을 위함.)
     * @param session
     * @throws Exception
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //소켓 연결
        chatMapper.resetStatus();
        sessionMap.put(session.getId(), session);
        LoginDTO loginDTO = (LoginDTO) session.getAttributes().get("loginInfo");
        ChatDTO chatDTO = new ChatDTO();
        userMap.put(session, loginDTO.getUserId());

        for (WebSocketSession key : userMap.keySet()) {
            chatDTO.setUserId(userMap.get(key));
            chatMapper.updateStatus(chatDTO);
        }

        for (String key : sessionMap.keySet()) {
            WebSocketSession wss = sessionMap.get(key);
            if(wss != null && wss.isOpen()) {
                try {
                    synchronized (wss) {
                        wss.sendMessage(new TextMessage("connect"));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * FUNCTION :: 클라이언트에서 웹 소켓 연결 종료시 해당 세션 맵에서 제거후 연결해제 메시지 클라이언트로 전달(오프라인 상태로 변경하기 위함.)
     * @param session
     * @param status
     * @throws Exception
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //소켓 종료
        chatMapper.resetStatus();
        sessionMap.remove(session.getId());
        ChatDTO chatDTO = new ChatDTO();
        userMap.remove(session);

        for (WebSocketSession key : userMap.keySet()) {
            chatDTO.setUserId(userMap.get(key));
            chatMapper.updateStatus(chatDTO);
        }

        for (String key : sessionMap.keySet()) {
            WebSocketSession wss = sessionMap.get(key);
            if(wss != null && wss.isOpen()) {
                try {
                    synchronized (wss) {
                        wss.sendMessage(new TextMessage("disconnect"));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}