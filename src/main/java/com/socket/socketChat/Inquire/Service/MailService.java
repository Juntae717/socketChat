package com.socket.socketChat.Inquire.Service;

import com.socket.socketChat.Inquire.Authenticator.SMTPAuthenticator;
import com.socket.socketChat.database.mybatis.dto.MailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import java.util.Properties;

import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.Authenticator;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSenderImpl mailImpl;
    Properties props = new Properties();

    public String sendInquireMail(MailDTO mailDTO) {
        try {
            // TLS 사용
            props.put("mail.smtp.port", "587");
            props.put("mail.smtp.starttls.enable", "true");

            props.put("mail.smtp.host", "mail4.secuecloud.com");
            props.put("mail.smtp.socketFactory.fallback", "false");
            props.put("mail.smtp.debug", "true");
            props.put("mail.smtp.auth", "true");

            // 인증정보
            Authenticator auth = new SMTPAuthenticator("0588@kiwontech.com", "123qwe!@#");
            Session mailSession = Session.getDefaultInstance(props, auth);

            MimeMessage mailMessage = mailImpl.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mailMessage, "UTF-8");

            message.setTo(mailDTO.getAddress());
            message.setFrom("0588@kiwontech.com");
            message.setSubject(mailDTO.getTitle());
            message.setText(mailDTO.getMessage(), true);

            mailImpl.setJavaMailProperties(props);
            mailImpl.setSession(mailSession);

            mailImpl.send(mailMessage);

            return "success";
        } catch (MessagingException e) {
            e.printStackTrace();

            return "error";
        }
    }
}