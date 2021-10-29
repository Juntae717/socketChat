package com.socket.socketChat.Chat.Aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * FUNCTION :: 중복 로직 모듈화
 */
@Component
@Aspect
public class socketChatAspect {
    /**
     * FUNCTION :: 로그인 세션 체크(로그인 세션이 있는 경우 채팅 페이지 접근 가능)
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("execution(* com.socket.socketChat.Chat.Service.socketChatService.Chat*(..))")
    public Object loginCheck(ProceedingJoinPoint joinPoint) throws Throwable{
        //Before
        System.out.println("Aop Login Check");

        HttpServletRequest request = null;
        for(Object args:joinPoint.getArgs()) {
            if(args instanceof HttpServletRequest) {
                request = (HttpServletRequest) args;
            }
        }

        if(request != null) {
                HttpSession session = request.getSession();
                if (session.getAttribute("loginInfo") == null) {
                    return "redirect:";
                }
        }

        return joinPoint.proceed();
        // After
    }
}
