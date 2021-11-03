package com.socket.socketChat.Inquire.Controller;

import com.socket.socketChat.Inquire.Service.InquireService;
import com.socket.socketChat.Inquire.Service.MailService;
import com.socket.socketChat.database.mybatis.dto.InquireDTO;
import com.socket.socketChat.database.mybatis.dto.MailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class InquireController {
    private final InquireService inquireService;
    private final MailService mailService;

    @RequestMapping("/inquire")
    public String inquire() { return "/inquire/inquire"; }

    @PostMapping("/inquire/search.do")
    @ResponseBody
    public List<InquireDTO> searchInquireData(InquireDTO inquireDTO) { return inquireService.searchInquireData(inquireDTO); }

    @RequestMapping("/inquire/form")
    public String inquireForm() { return "/inquire/form"; }

    @PostMapping("/inquire/form/mail.do")
    @ResponseBody
    public String sendInquireMail(MailDTO mailDTO) { return mailService.sendInquireMail(mailDTO); }

    @PostMapping("/inquire/form/save.do")
    @ResponseBody
    public String saveInquireData(InquireDTO inquireDTO) { return inquireService.saveInquireData(inquireDTO); }

    @RequestMapping("/inquire/view")
    public String inquireView() { return "/inquire/view"; }

    @PostMapping("/inquire/view/load.do")
    @ResponseBody
    public InquireDTO getInquireDataByIdx(InquireDTO inquireDTO) { return inquireService.getInquireDataByIdx(inquireDTO); }
}