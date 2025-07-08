import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const baseURL = `http://localhost:8080/invoices`;
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const pending = invoices
      .reduce((total, invoice) => total + (invoice.total || 0), 0); 
    setPendingAmount(pending);
  }, [invoices]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseURL); 
      setInvoices(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };
  const deleteUrl = `http://localhost:8080/delete/`;
const handleDelete = async (id) => {
  try {
    setLoading(true);
    const res= await axios.delete(`${deleteUrl}${id}`);
    if(res.status==204) {
      console.log("Deleted");
      toast.success("Deleted File SuccessFUlly");
      navigate('/dashboard');
    }
  } catch (error) {
    setError('Failed to delete invoice. Please try again.');
    console.error(`Error in deleting it: ${error}`);
  } finally {
    setLoading(false);
  }
};

    
  const handleCreateInvoice = () => {
    navigate('/generate');
  };

  const handlePaymentStatusChange = async (invoiceId, isPaid) => {
    try {
      await axios.put(`${baseURL}/${invoiceId}/status`, { isPaid }); 
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === invoiceId ? { ...invoice, isPaid } : invoice
        )
      );
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; 
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="text-center mt-3">
          <h5>Loading invoices...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h2 mb-0 text-primary">Invoice Dashboard</h1>
            <button className="btn btn-primary btn-lg" onClick={handleCreateInvoice}>
              <i className="bi bi-plus-circle me-2"></i>
              Create New Invoice
            </button>
          </div>
          <hr className="my-3" />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-file-earmark-text fs-1"></i>
              </div>
              <h5 className="card-title text-muted">Total Invoices</h5>
              <h2 className="text-primary">{invoices.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="bi bi-check-circle fs-1"></i>
              </div>
              <h5 className="card-title text-muted">Paid Invoices</h5>
              <h2 className="text-success">{invoices.filter(inv => inv.isPaid).length}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-clock fs-1"></i>
              </div>
              <h5 className="card-title text-muted">Pending Invoices</h5>
              <h2 className="text-warning">{invoices.filter(inv => !inv.isPaid).length}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100 border-0 shadow-sm bg-danger text-white">
            <div className="card-body text-center">
              <div className="mb-2">
                <i className="bi bi-currency-rupee fs-1"></i>
              </div>
              <h5 className="card-title">Pending Amount</h5>
              <h2>{formatCurrency(pendingAmount)}</h2>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
              <div>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
              <button onClick={fetchInvoices} className="btn btn-outline-danger btn-sm">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                All Invoices
              </h4>
              <button onClick={fetchInvoices} className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>

            <div className="card-body p-0">
              {invoices.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                  </div>
                  <h5 className="text-muted">No invoices found</h5>
                  <p className="text-muted">Create your first invoice to get started!</p>
                  <button className="btn btn-primary" onClick={handleCreateInvoice}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Invoice
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th><i className="bi bi-hash me-1"></i>Invoice #</th>
                        <th><i className="bi bi-person me-1"></i>Client Name</th>
                        <th><i className="bi bi-calendar me-1"></i>Date</th>
                        <th><i className="bi bi-calendar-check me-1"></i>Due Date</th>
                        <th><i className="bi bi-currency-rupee me-1"></i>Amount</th>
                        <th><i className="bi bi-credit-card me-1"></i>Status</th>
                        <th><i className="bi bi-gear me-1"></i>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className={invoice.isPaid ? 'table-success' : 'table-warning'}>
                          <td><span className="badge bg-primary">{invoice.invoiceNumber || `INV-${invoice.id}`}</span></td>
                          <td><strong>{invoice.billing?.name || 'N/A'}</strong></td>
                          <td><small className="text-muted">{formatDate(invoice.date || invoice.createdAt)}</small></td>
                          <td><small className="text-muted">{formatDate(invoice.dueDate)}</small></td>
                          <td><strong className="text-success">{formatCurrency(invoice.total)}</strong></td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`payment-${invoice.id}`}
                                checked={invoice.isPaid || false}
                                onChange={(e) =>
                                  handlePaymentStatusChange(invoice.id, e.target.checked)
                                }
                              />
                              <label className="form-check-label" htmlFor={`payment-${invoice.id}`}>
                                <span className={`badge ${invoice.isPaid ? 'bg-success' : 'bg-warning'}`}>
                                  {invoice.isPaid ? (
                                    <>
                                      <i className="bi bi-check-circle me-1"></i>Paid
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-clock me-1"></i>Pending
                                    </>
                                  )}
                                </span>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button className="btn btn-outline-info btn-sm" onClick={() => navigate(`/invoice/${invoice.id}`)} title="View Invoice">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-warning btn-sm" onClick={()=>handleDelete(invoice.id)} title="Delete Invoice">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-secondary btn-sm" title="Download PDF">
                                <i className="bi bi-download"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
