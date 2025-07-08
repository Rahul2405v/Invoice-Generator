import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const initialInvoiceData = {
  title: "New Invoice",
  billing: {
    name: "",
    phone: "",
    address: ""
  },
  shipping: {
    name: "",
    phone: "",
    address: ""
  },
  invoice: {
    number: "",
    date: "",
    dueDate: ""
  },
  account: {
    name: "",
    number: "",
    ifscCode: ""
  },
  company: {
    name: "",
    number: "",
    address: ""
  },
  tax: 0,
  notes: "",
  items: [
    {
      name: "",
      qty: 0,
      amount: 0,
      description: "",
      total: 0
    }
  ],
  logo: null,
  total: 0,
  isPaid:false,
};

export const AppContextProvider = ({ children }) => {
  // Full invoice data
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [invoiceTitle, setInvoiceTitle] = useState(initialInvoiceData.title); // Fixed: was initialInvoiceState.title
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const baseURL="http:localhost:8080/api/invoices"; 
  // Fixed: Proper context value object
  const contextValue = {
    invoiceTitle,
    setInvoiceTitle,
    invoiceData,
    setInvoiceData,
    selectedTemplate,
    setSelectedTemplate,
    initialInvoiceData,
    baseURL
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};