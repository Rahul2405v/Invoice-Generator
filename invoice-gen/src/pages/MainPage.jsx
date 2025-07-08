import React, { useState, useContext } from "react";
import { Pencil } from "lucide-react";
import { AppContext } from "../context/AppContextProvider"; // update path if needed
import InvoiceForm from "../components/InvoiceForm";

const MainPage = () => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { invoiceTitle, setInvoiceTitle,invoiceData,setInvoiceData } = useContext(AppContext);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setInvoiceTitle(newTitle);
    setInvoiceData((prevData) => ({
      ...prevData,
      title: newTitle
    }));
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Title Section */}
        <div className="bg-white border rounded shadow-sm p-3 mb-4">
          <div className="d-flex align-items-center">
            {isEditingTitle ? (
              <input
                type="text"
                className="form-control me-2"
                value={invoiceTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                autoFocus
              />
            ) : (
              <>
                <h4 className="me-3 mb-0">{invoiceTitle}</h4>
                <Pencil
                  className="text-secondary"
                  style={{ cursor: "pointer" }}
                  onClick={handleTitleEdit}
                />
              </>
            )}
          </div>
        </div>

        {/* Main content placeholder */}
        <div className="bg-white border rounded p-4 shadow-sm">
         <InvoiceForm />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
