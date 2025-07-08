package com.invoice.generator.controller;

import com.invoice.generator.entity.Invoice;
import com.invoice.generator.service.EmailService;
import com.invoice.generator.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;
    @Value("${clerk.issuer}")
    private String clerkIssuer;
    private final EmailService emailService;
    @PostMapping("/invoice")
    public ResponseEntity<Invoice> saveInvoiceN(@RequestBody Invoice invoice) {
        Invoice savedInvoice = invoiceService.saveInvoice(invoice);
        return ResponseEntity.ok(savedInvoice);
    }
    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> fetchAll(){
        return ResponseEntity.ok(invoiceService.fetchInvoices());
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable String id){
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/sendemail")
    public ResponseEntity<?> sendInvoice(@RequestPart("file") MultipartFile file,
                                         @RequestPart("email") String customerEmail){
            try{
                emailService.sendInvoiceEmail(customerEmail,file);
                return ResponseEntity.ok().body("Invoice Sent Successfully");
            }catch (Exception m) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to Send Invoice");
            }
    }

}