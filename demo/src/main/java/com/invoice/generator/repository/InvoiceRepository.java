package com.invoice.generator.repository;

import com.invoice.generator.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvoiceRepository extends MongoRepository<Invoice, String> {

    // Custom query methods can be defined here if needed

}
