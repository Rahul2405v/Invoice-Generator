package com.invoice.generator.service;

import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
    public void sendInvoiceEmail(String toEmail, MultipartFile file) throws MessagingException, IOException {

        MimeMessage message=  mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(message,true);
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Your New Invoice from Rahul's Website");
        helper.setText("Dear Customer, Here is your Invoice");
        helper.addAttachment(file.getOriginalFilename(),new ByteArrayResource(file.getBytes()));
        mailSender.send(message);
    }
}
