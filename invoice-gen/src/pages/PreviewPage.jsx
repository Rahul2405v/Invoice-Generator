import React, { useContext, useRef, useState } from 'react';
import { AppContext } from '../context/AppContextProvider';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { uploadPDF } from '../service/couldinaryService';
import html2pdf from 'html2pdf.js';

const PreviewPage = () => {
  const previewRef = useRef();
  const { invoiceData, selectedTemplate, setSelectedTemplate } = useContext(AppContext);
  const [activeTemplate, setActiveTemplate] = useState(selectedTemplate || 'modern-blue');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (invoiceData.tax / 100);
  const total = subtotal + taxAmount;
const handleSendEmail = async () => {
    if (!recipientEmail) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setEmailLoading(true);

      const element = previewRef.current;
      if (!element) throw new Error('Preview element not found');

      await document.fonts.ready;

      // Configure PDF options (same as save function)
      const opt = {
        margin: 0.5,
        filename: `invoice-${invoiceData.invoice.number || 'template'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#fff",
          scrollY: 0,
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF blob
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
      // Create FormData
      const formData = new FormData();
      formData.append('file', pdfBlob, `invoice-${invoiceData.invoice.number || 'template'}.pdf`);
      formData.append('email', recipientEmail);

      // Send email
      const response = await axios.post('http://localhost:8080/sendemail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Invoice sent successfully to ' + recipientEmail);
        setShowEmailModal(false);
        setRecipientEmail('');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };
   const handleDownloadPDF = async () => {
    try {
      setLoading(true);

      const element = previewRef.current;
      if (!element) throw new Error('Preview element not found');

      await document.fonts.ready;

      const opt = {
        margin: 0.5,
        filename: `invoice-${invoiceData.invoice.number || 'template'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#fff",
          scrollY: 0,
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Generate and download PDF
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };
const handleSaveAndExit = async () => {
  try {
    setLoading(true);

    const element = previewRef.current;
    if (!element) throw new Error('Preview element not found');

    await document.fonts.ready;

    // Configure PDF options
    const opt = {
      margin: 0.5,
      filename: `invoice-${invoiceData.invoice.number || 'template'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        scrollY: 0,
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF blob
    const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');

    // Upload to Cloudinary
    const url = await uploadPDF(pdfBlob);

    // Prepare payload
    const payload = {
      ...invoiceData,
      logo: url, // Save PDF URL (not logo)
      template: selectedTemplate || activeTemplate,
      total: total,
      createdAt: new Date().toISOString()
    };

    const response = await axios.post("http://localhost:8080/invoice", payload);

    if (response.status === 200 || response.status === 201) {
      alert('Invoice saved successfully!');
      navigate('/dashboard');
    } else {
      throw new Error('Failed to save invoice');
    }
  } catch (error) {
    console.error('Error saving invoice:', error);
    alert('Error saving invoice. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Template configurations
  const templates = {
    'modern-blue': {
      name: 'Modern Blue',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      backgroundColor: '#f8fafc',
      textColor: '#1f2937'
    },
    'classic-white': {
      name: 'Classic White',
      primaryColor: '#374151',
      secondaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    'creative-green': {
      name: 'Creative Green',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      backgroundColor: '#f0fdf4',
      textColor: '#1f2937'
    },
    'corporate-red': {
      name: 'Corporate Red',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      backgroundColor: '#fef2f2',
      textColor: '#1f2937'
    },
    'minimalist-purple': {
      name: 'Minimalist Purple',
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      backgroundColor: '#faf5ff',
      textColor: '#1f2937'
    },
    'tech-orange': {
      name: 'Tech Orange',
      primaryColor: '#ea580c',
      secondaryColor: '#c2410c',
      backgroundColor: '#fff7ed',
      textColor: '#1f2937'
    }
  };

  const currentTemplate = templates[activeTemplate];

  const handleTemplateSelect = (templateId) => {
    setActiveTemplate(templateId);
    setSelectedTemplate(templateId);
  };

  // Helper function to safely display logo
  const renderLogo = (className = "", style = {}) => {
    if (invoiceData.logo) {
      const logoSrc = typeof invoiceData.logo === 'string' 
        ? invoiceData.logo 
        : URL.createObjectURL(invoiceData.logo);
      
      return (
        <img 
          src={logoSrc} 
          alt="Company Logo" 
          className={className}
          style={style}
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    return null;
  };

  const ModernBlueTemplate = () => (
    <div className="card shadow-lg" style={{ backgroundColor: currentTemplate.backgroundColor }}>
      <div className="card-header text-white p-4" style={{ backgroundColor: currentTemplate.primaryColor }}>
        <div className="row align-items-center">
          <div className="col-6">
            <h1 className="h2 mb-0 fw-bold">INVOICE</h1>
            <p className="mb-0 opacity-75">#{invoiceData.invoice.number || 'INV-001'}</p>
          </div>
          <div className="col-6 text-end">
            {invoiceData.logo ? (
              renderLogo("img-fluid", { maxHeight: '60px' })
            ) : (
              <div className="bg-white rounded p-2 d-inline-block">
                <span style={{ color: currentTemplate.primaryColor }}>LOGO</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="row mb-4">
          <div className="col-md-6">
            <h5 className="fw-bold mb-3" style={{ color: currentTemplate.primaryColor }}>From:</h5>
            <div>
              <strong>{invoiceData.company.name || 'Company Name'}</strong><br />
              {invoiceData.company.number || 'Phone Number'}<br />
              {invoiceData.company.address || 'Company Address'}
            </div>
          </div>
          <div className="col-md-6">
            <h5 className="fw-bold mb-3" style={{ color: currentTemplate.primaryColor }}>To:</h5>
            <div>
              <strong>{invoiceData.billing.name || 'Client Name'}</strong><br />
              {invoiceData.billing.phone || 'Client Phone'}<br />
              {invoiceData.billing.address || 'Client Address'}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <small className="text-muted">Invoice Date</small><br />
            <strong>{invoiceData.invoice.date || new Date().toISOString().split('T')[0]}</strong>
          </div>
          <div className="col-md-4">
            <small className="text-muted">Due Date</small><br />
            <strong>{invoiceData.invoice.dueDate || new Date().toISOString().split('T')[0]}</strong>
          </div>
          <div className="col-md-4">
            <small className="text-muted">Amount Due</small><br />
            <strong className="h5" style={{ color: currentTemplate.primaryColor }}>₹{total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="table-responsive mb-4">
          <table className="table table-borderless">
            <thead style={{ backgroundColor: currentTemplate.primaryColor + '20' }}>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Rate</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || `Item ${index + 1}`}</td>
                  <td className="text-muted">{item.description || 'Item description'}</td>
                  <td className="text-end">{item.qty || 1}</td>
                  <td className="text-end">₹{(item.amount || 0).toFixed(2)}</td>
                  <td className="text-end fw-bold">₹{(item.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-md-6">
            {invoiceData.notes && (
              <div>
                <h6 className="fw-bold" style={{ color: currentTemplate.primaryColor }}>Notes:</h6>
                <p className="small">{invoiceData.notes}</p>
              </div>
            )}
            {(invoiceData.account.name || invoiceData.account.number) && (
              <div>
                <h6 className="fw-bold" style={{ color: currentTemplate.primaryColor }}>Payment Details:</h6>
                <small>
                  Account: {invoiceData.account.name || 'Account Name'}<br />
                  Number: {invoiceData.account.number || 'Account Number'}<br />
                  IFSC: {invoiceData.account.ifscCode || 'IFSC Code'}
                </small>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="bg-light p-3 rounded">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax ({invoiceData.tax || 0}%):</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold h5" style={{ color: currentTemplate.primaryColor }}>
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ClassicWhiteTemplate = () => (
    <div className="card" style={{ backgroundColor: currentTemplate.backgroundColor, border: '2px solid #e5e7eb' }}>
      <div className="card-body p-5">
        <div className="row mb-4">
          <div className="col-6">
            <div className="text-center">
              <h1 className="display-4 fw-bold" style={{ color: currentTemplate.primaryColor }}>INVOICE</h1>
              <p className="lead">#{invoiceData.invoice.number || 'INV-001'}</p>
            </div>
          </div>
          <div className="col-6 text-end">
            {invoiceData.logo ? (
              renderLogo("img-fluid", { maxHeight: '80px' })
            ) : (
              <div className="border rounded p-3 d-inline-block">
                <span style={{ color: currentTemplate.primaryColor }}>COMPANY LOGO</span>
              </div>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <h6 className="text-uppercase fw-bold mb-3">Bill From</h6>
            <address>
              <strong>{invoiceData.company.name || 'Company Name'}</strong><br />
              {invoiceData.company.address || 'Company Address'}<br />
              {invoiceData.company.number || 'Phone Number'}
            </address>
          </div>
          <div className="col-md-6">
            <h6 className="text-uppercase fw-bold mb-3">Bill To</h6>
            <address>
              <strong>{invoiceData.billing.name || 'Client Name'}</strong><br />
              {invoiceData.billing.address || 'Client Address'}<br />
              {invoiceData.billing.phone || 'Client Phone'}
            </address>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <strong>Invoice Date:</strong><br />
            {invoiceData.invoice.date || new Date().toISOString().split('T')[0]}
          </div>
          <div className="col-md-4">
            <strong>Due Date:</strong><br />
            {invoiceData.invoice.dueDate || new Date().toISOString().split('T')[0]}
          </div>
          <div className="col-md-4">
            <strong>Amount Due:</strong><br />
            <span className="h4" style={{ color: currentTemplate.primaryColor }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Description</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Unit Price</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{item.name || `Item ${index + 1}`}</strong><br />
                  <small className="text-muted">{item.description || 'Item description'}</small>
                </td>
                <td className="text-end">{item.qty || 1}</td>
                <td className="text-end">${(item.amount || 0).toFixed(2)}</td>
                <td className="text-end">${(item.total || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Subtotal:</td>
              <td className="text-end">${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Tax ({invoiceData.tax || 0}%):</td>
              <td className="text-end">${taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-end fw-bold h5">Total:</td>
              <td className="text-end fw-bold h5">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {invoiceData.notes && (
          <div className="mt-4">
            <h6 className="fw-bold">Terms & Conditions</h6>
            <p>{invoiceData.notes}</p>
          </div>
        )}

        {(invoiceData.account.name || invoiceData.account.number) && (
          <div className="mt-4">
            <h6 className="fw-bold">Payment Information</h6>
            <div className="row">
              <div className="col-md-4">
                <small>Account Name: {invoiceData.account.name || 'N/A'}</small>
              </div>
              <div className="col-md-4">
                <small>Account Number: {invoiceData.account.number || 'N/A'}</small>
              </div>
              <div className="col-md-4">
                <small>IFSC Code: {invoiceData.account.ifscCode || 'N/A'}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const CreativeTemplate = () => (
    <div className="card shadow-lg overflow-hidden">
      <div className="position-relative" style={{ background: `linear-gradient(135deg, ${currentTemplate.primaryColor}, ${currentTemplate.secondaryColor})` }}>
        <div className="card-body text-white p-4">
          <div className="row align-items-center">
            <div className="col-8">
              <h1 className="display-5 fw-bold mb-1">INVOICE</h1>
              <p className="mb-0 opacity-75">#{invoiceData.invoice.number || 'INV-001'}</p>
            </div>
            <div className="col-4 text-end">
              {invoiceData.logo ? (
                <div className="bg-white rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                  {renderLogo("img-fluid rounded-circle", { maxWidth: '60px', maxHeight: '60px' })}
                </div>
              ) : (
                <div className="bg-white rounded-circle p-3 d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                  <span className="fw-bold" style={{ color: currentTemplate.primaryColor, fontSize: '10px' }}>LOGO</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <svg className="position-absolute bottom-0 start-0 w-100" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ height: '20px' }}>
          <path d="M0,20 Q50,0 100,20 L100,20 L0,20 Z" fill={currentTemplate.backgroundColor}></path>
        </svg>
      </div>

      <div className="card-body p-4" style={{ backgroundColor: currentTemplate.backgroundColor }}>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="p-3 rounded" style={{ backgroundColor: 'white', border: `3px solid ${currentTemplate.primaryColor}` }}>
              <h6 className="fw-bold mb-2" style={{ color: currentTemplate.primaryColor }}>From</h6>
              <div>
                <strong>{invoiceData.company.name || 'Company Name'}</strong><br />
                <small>{invoiceData.company.address || 'Company Address'}</small><br />
                <small>{invoiceData.company.number || 'Phone Number'}</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded bg-white">
              <h6 className="fw-bold mb-2" style={{ color: currentTemplate.primaryColor }}>To</h6>
              <div>
                <strong>{invoiceData.billing.name || 'Client Name'}</strong><br />
                <small>{invoiceData.billing.address || 'Client Address'}</small><br />
                <small>{invoiceData.billing.phone || 'Client Phone'}</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded text-white" style={{ backgroundColor: currentTemplate.primaryColor }}>
              <h6 className="fw-bold mb-2">Total Due</h6>
              <div className="h3 mb-0">${total.toFixed(2)}</div>
              <small>Due: {invoiceData.invoice.dueDate || 'N/A'}</small>
            </div>
          </div>
        </div>

        <div className="bg-white rounded p-3 mb-4">
          <table className="table table-borderless mb-0">
            <thead>
              <tr style={{ backgroundColor: currentTemplate.primaryColor + '15' }}>
                <th style={{ color: currentTemplate.primaryColor }}>Item</th>
                <th className="text-end" style={{ color: currentTemplate.primaryColor }}>Qty</th>
                <th className="text-end" style={{ color: currentTemplate.primaryColor }}>Rate</th>
                <th className="text-end" style={{ color: currentTemplate.primaryColor }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <strong>{item.name || `Item ${index + 1}`}</strong>
                      {item.description && <br />}
                      <small className="text-muted">{item.description}</small>
                    </div>
                  </td>
                  <td className="text-end">{item.qty || 1}</td>
                  <td className="text-end">${(item.amount || 0).toFixed(2)}</td>
                  <td className="text-end fw-bold">${(item.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-md-6">
            {invoiceData.notes && (
              <div className="bg-white rounded p-3 mb-3">
                <h6 className="fw-bold mb-2" style={{ color: currentTemplate.primaryColor }}>Notes</h6>
                <p className="mb-0 small">{invoiceData.notes}</p>
              </div>
            )}
            {(invoiceData.account.name || invoiceData.account.number) && (
              <div className="bg-white rounded p-3">
                <h6 className="fw-bold mb-2" style={{ color: currentTemplate.primaryColor }}>Payment Info</h6>
                <small>
                  Account: {invoiceData.account.name || 'N/A'}<br />
                  Number: {invoiceData.account.number || 'N/A'}<br />
                  IFSC: {invoiceData.account.ifscCode || 'N/A'}
                </small>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="bg-white rounded p-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax ({invoiceData.tax || 0}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <hr style={{ borderColor: currentTemplate.primaryColor }} />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold h5" style={{ color: currentTemplate.primaryColor }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (activeTemplate) {
      case 'classic-white':
        return <ClassicWhiteTemplate />;
      case 'creative-green':
      case 'corporate-red':
      case 'minimalist-purple':
      case 'tech-orange':
        return <CreativeTemplate />;
      default:
        return <ModernBlueTemplate />;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">Invoice Preview</h2>
          
          {/* Template Selector */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Choose Template</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Object.entries(templates).map(([key, template]) => (
                      <div key={key} className="col-md-2 col-sm-4 col-6 mb-3">
                        <div 
                          className={`card h-100 cursor-pointer ${activeTemplate === key ? 'border-primary border-3' : 'border-2'}`}
                          onClick={() => handleTemplateSelect(key)}
                          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        >
                          <div 
                            className="card-header text-white text-center p-2"
                            style={{ backgroundColor: template.primaryColor }}
                          >
                            <small className="fw-bold">{template.name}</small>
                          </div>
                          <div className="card-body p-2" style={{ backgroundColor: template.backgroundColor }}>
                            <div className="text-center">
                              <div 
                                className="rounded mb-1"
                                style={{ 
                                  height: '20px', 
                                  backgroundColor: template.primaryColor + '30',
                                  border: `1px solid ${template.primaryColor}`
                                }}
                              ></div>
                              <div className="d-flex gap-1">
                                <div 
                                  className="rounded flex-fill"
                                  style={{ 
                                    height: '8px', 
                                    backgroundColor: template.primaryColor + '20'
                                  }}
                                ></div>
                                <div 
                                  className="rounded flex-fill"
                                  style={{ 
                                    height: '8px', 
                                    backgroundColor: template.primaryColor + '20'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          {activeTemplate === key && (
                            <div className="position-absolute top-0 end-0 m-2">
                              <i className="fas fa-check-circle text-primary"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <div style={{ width: '100%', maxWidth: '800px' }} ref={previewRef}>
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>

           {/* Action Buttons */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>
            <i className="fas fa-edit me-2"></i>Edit Invoice
          </button>
          <button 
            className="btn btn-primary me-2" 
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="me-2" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Downloading...
              </>
            ) : (
              <>
                <i className="fas fa-download me-2"></i>Download PDF
              </>
            )}
          </button>
          <button 
            className="btn btn-success me-2"
            onClick={() => setShowEmailModal(true)}
            disabled={emailLoading}
          >
            <i className="fas fa-paper-plane me-2"></i>Send Invoice
          </button>
          <button 
            className="btn btn-info" 
            onClick={handleSaveAndExit} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="me-2" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Save & Exit
              </>
            )}
          </button>
        </div>
      </div>
 {/* Email Modal */}
      {showEmailModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Invoice via Email</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailLoading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="recipientEmail" className="form-label">
                    Recipient Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="recipientEmail"
                    placeholder="Enter email address"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    disabled={emailLoading}
                    required/>
                </div>
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  The invoice will be sent as a PDF attachment to the specified email address.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailLoading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handleSendEmail}
                  disabled={emailLoading || !recipientEmail}
                >
                  {emailLoading ? (
                    <>
                      <Loader2 className="me-2" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Email
                    </> )}
                </button>
              </div>
               </div>
          </div>
        </div>
      )}

          {/* Invoice Data Summary */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Invoice Summary</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <h6>Invoice Details</h6>
                      <small>
                        Number: {invoiceData.invoice.number || 'Not set'}<br />
                        Date: {invoiceData.invoice.date || 'Not set'}<br />
                        Due Date: {invoiceData.invoice.dueDate || 'Not set'}
                      </small>
                    </div>
                    <div className="col-md-3">
                      <h6>Company</h6>
                      <small>
                        {invoiceData.company.name || 'Not set'}<br />
                        {invoiceData.company.number || 'Not set'}
                      </small>
                    </div>
                    <div className="col-md-3">
                      <h6>Client</h6>
                      <small>
                        {invoiceData.billing.name || 'Not set'}<br />
                        {invoiceData.billing.phone || 'Not set'}
                      </small>
                    </div>
                    <div className="col-md-3">
                      <h6>Financial</h6>
                      <small>
                        Items: {invoiceData.items.length}<br />
                        Tax: {invoiceData.tax || 0}%<br />
                        <strong>Total: ₹{total.toFixed(2)}</strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PreviewPage;