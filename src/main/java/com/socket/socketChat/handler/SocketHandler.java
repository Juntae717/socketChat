package com.socket.socketChat.handler;

import com.socket.socketChat.database.mybatis.dto.ChatDTO;
import com.socket.socketChat.database.mybatis.mapper.ChatMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;

@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {
    private final ChatMapper chatMapper;

    HashMap<String, WebSocketSession> sessionMap = new HashMap<>(); //웹소켓 세션을 담아둘 맵

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        //메시지 발송
        String msg = message.getPayload();

        if(msg.startsWith("sendId=")) {
            // DB Update
            msg = msg.replace("sendId=", "");

            ChatDTO chatDTO = new ChatDTO();
            chatDTO.setUserId(msg);

            chatMapper.updateStatus(chatDTO);
        } else {
            msg = msg.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
                    .replace("'", "&apos;").replace("\\", "&#x2F;").replace(" ", "&nbsp;").replace("\n", "<br/>");
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

    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //소켓 연결
        chatMapper.resetStatus();
        sessionMap.put(session.getId(), session);
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

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //소켓 종료
        chatMapper.resetStatus();

        sessionMap.remove(session.getId());
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
