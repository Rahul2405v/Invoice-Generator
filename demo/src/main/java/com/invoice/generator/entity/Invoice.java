package com.invoice.generator.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.time.Instant;

@Data
@Document(collection="Invoices")
public class Invoice {
    @Id
    private String id;
    private Company company;
    private Billing billing;
    private Shipping shipping;
    private Invoice invoice;
    private Account account;
    private List<Item> items;
    private String notes;
    private String logo;
    private double tax;
    @CreatedDate
    private Instant createdAt;
    private String title;
    private int total;
    private boolean isPaid;
    @Data
    public static class Company {
        private String name;
        private String number;
        private String address;
    }
    @Data
    public static class Billing {
        private String name;
        private String phone;
        private String address;
    }
    @Data
    public static class Shipping {
        private String name;
        private String phone;
        private String address;
    }
    @Data
    public static class InvoiceNumber {
        private String number;
        private String date;
        private String dueDate;
    }
    @Data
    public static class Account {
        private String name;
        private String number;
        private String ifscCode;
    }
    @Data
    public static class Item {
        private String name;
        private int qty;
        private double amount;
        private String description;
        private double total;
    }
}