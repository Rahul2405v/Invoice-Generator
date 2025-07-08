import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContextProvider";
import { Navigate, useNavigate } from "react-router-dom";

const InvoiceForm = () => {
  const { invoiceData, setInvoiceData } = useContext(AppContext);
  const [logoPreview, setLogoPreview] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const navigate = useNavigate();
  // Calculate subtotal from context items
  const cAlculateItemTotals = (items) => {
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (invoiceData.tax / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };  
  }
  const { subtotal, taxAmount, total } = cAlculateItemTotals(invoiceData.items);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setInvoiceData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleSameAsBillingChange = (e) => {
    setSameAsBilling(e.target.checked);
    if (e.target.checked) {
      setInvoiceData(prev => ({
        ...prev,
        shipping: { ...prev.billing }
      }));
    }
  };

  // Handle input changes for different sections
  const handleInputChange = (section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle direct field changes (like title, tax, notes)
  const handleDirectFieldChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = field === "qty" || field === "amount" ? Number(value) : value;
    updatedItems[index].total = updatedItems[index].qty * updatedItems[index].amount;
    
    setInvoiceData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Add new item
  const addItem = () => {
    const newItem = { name: "", description: "", qty: 1, amount: 0, total: 0 };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  // Delete item
  const deleteItem = (index) => {
    if (invoiceData.items.length > 1) {
      const updatedItems = invoiceData.items.filter((_, i) => i !== index);
      setInvoiceData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };
  const handleSubmit = () => {
    // Here you would typically handle form submission, e.g., send data to server
    console.log("Invoice Data Submitted:", invoiceData);
    alert("Invoice generated successfully!");
  }
  // Auto-copy billing to shipping when same as billing is checked
  useEffect(() => {
    if (sameAsBilling) {
      setInvoiceData(prev => ({
        ...prev,
        shipping: { ...prev.billing }
      }));
    }
  }, [invoiceData.billing, sameAsBilling, setInvoiceData]);

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4 text-primary">Create Invoice</h2>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="mb-3">
            <label className="form-label fw-bold">Invoice Title</label>
            <input
              type="text"
              className="form-control"
              value={invoiceData.title}
              onChange={(e) => handleDirectFieldChange('title', e.target.value)}
              placeholder="Enter invoice title"
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="mb-3">
            <label className="form-label fw-bold">Company Logo</label>
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                id="logo-upload"
                className="d-none"
              />
              <label htmlFor="logo-upload" className="btn btn-outline-secondary p-3 border-2 border-dashed">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="img-fluid" style={{maxHeight: '100px'}} />
                ) : (
                  <div className="d-flex flex-column align-items-center">
                    <img src={assets.upload} alt="Upload" className="mb-2" style={{width: '40px'}} />
                    <span>Click to Upload Logo</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Company Information</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceData.company.name}
                  onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Company Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={invoiceData.company.number}
                  onChange={(e) => handleInputChange('company', 'number', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Company Address</label>
                <textarea
                  className="form-control"
                  value={invoiceData.company.address}
                  onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                  placeholder="Enter company address"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Invoice Details</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Invoice Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceData.invoice.number}
                  onChange={(e) => handleInputChange('invoice', 'number', e.target.value)}
                  placeholder="INV-001"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Invoice Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={invoiceData.invoice.date}
                  onChange={(e) => handleInputChange('invoice', 'date', e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={invoiceData.invoice.dueDate}
                  onChange={(e) => handleInputChange('invoice', 'dueDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">Bill To</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceData.billing.name}
                  onChange={(e) => handleInputChange('billing', 'name', e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Client Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={invoiceData.billing.phone}
                  onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Billing Address</label>
                <textarea
                  className="form-control"
                  value={invoiceData.billing.address}
                  onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
                  placeholder="Enter billing address"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="card mb-4">
        <div className="card-header bg-warning text-dark">
          <h4 className="mb-0">Ship To</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sameAsBilling"
                  checked={sameAsBilling}
                  onChange={handleSameAsBillingChange}
                />
                <label className="form-check-label" htmlFor="sameAsBilling">
                  Same as billing address
                </label>
              </div>
            </div>
          </div>
          {!sameAsBilling && (
            <>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Recipient Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={invoiceData.shipping.name}
                      onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                      placeholder="Enter recipient name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Recipient Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={invoiceData.shipping.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Shipping Address</label>
                    <textarea
                      className="form-control"
                      value={invoiceData.shipping.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      placeholder="Enter shipping address"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          <h4 className="mb-0">Payment Details</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Account Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceData.account.name}
                  onChange={(e) => handleInputChange('account', 'name', e.target.value)}
                  placeholder="Enter account holder name"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceData.account.number}
                  onChange={(e) => handleInputChange('account', 'number', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceData.account.ifscCode}
                  onChange={(e) => handleInputChange('account', 'ifscCode', e.target.value)}
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Items</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate (₹)</th>
                  <th>Total (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Item name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td>
                      <span className="fw-bold">₹{item.total.toFixed(2)}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteItem(index)}
                        className="btn btn-danger btn-sm"
                        disabled={invoiceData.items.length === 1}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-12">
              <button type="button" onClick={addItem} className="btn btn-success">
                <i className="fas fa-plus me-2"></i>Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax and Total */}
      <div className="card mb-4">
        <div className="card-header bg-danger text-white">
          <h4 className="mb-0">Tax & Total</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Tax Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={invoiceData.tax}
                  onChange={(e) => handleDirectFieldChange('tax', Number(e.target.value))}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="bg-light p-3 rounded">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax ({invoiceData.tax}%):</span>
                  <span className="fw-bold">₹{taxAmount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h5">Total:</span>
                  <span className="h5 text-primary fw-bold">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Additional Notes</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <textarea
              className="form-control"
              value={invoiceData.notes}
              onChange={(e) => handleDirectFieldChange('notes', e.target.value)}
              placeholder="Enter any additional notes or terms"
              rows="4"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row">
        <div className="col-12 text-center">
          <button type="button" className="btn btn-outline-secondary me-3">
            Save as Draft
          </button>
          <button type="button" className="btn btn-primary me-3" onClick={() => navigate('/preview')}>
            Preview Invoice
          </button>
          <button type="button" className="btn btn-success" onClick={handleSubmit}>
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
