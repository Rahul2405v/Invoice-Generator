package com.invoice.generator.service;

import com.invoice.generator.entity.Invoice;
import com.invoice.generator.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }
    public List<Invoice> fetchInvoices(){
        return invoiceRepository.findAll();
    }
    public void deleteInvoice(String InvoiceId){
        Invoice up=invoiceRepository.findById(InvoiceId).orElseThrow(()-> new RuntimeException("Error in Deleting Document "+InvoiceId));
        invoiceRepository.delete(up);
    }

}
