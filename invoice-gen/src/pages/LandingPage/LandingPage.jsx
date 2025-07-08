import React, { useEffect } from 'react';
import AOS from 'aos';


const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      {/* <section className="container py-5 flex-grow-1 d-flex flex-column justify-content-center">
        <div className="row align-items-center">
          <div className="col-md-6" data-aos="fade-right">
            <h1 className="display-4 fw-bold text-primary animate__animated animate__fadeInDown">
              Smart Invoice Generator
            </h1>
            <p className="lead text-muted mt-3 animate__animated animate__fadeInUp">
              Create, manage, and download invoices effortlessly. Perfect for freelancers and businesses.
            </p>
            <button className="btn btn-primary btn-lg mt-4 animate__animated animate__bounceIn">
              Get Started
            </button>
          </div>

          <div className="col-md-6 text-center mt-4 mt-md-0" data-aos="zoom-in">
            <img
              src={hero}
              alt="Invoice illustration"
              className="img-fluid animate__animated animate__fadeInUp"
              style={{ maxHeight: '350px' }}
            />
          </div>
        </div>
      </section> */}

      {/* Features */}
      <section className="bg-white py-5 border-top">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">Features</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="p-4 border rounded text-center h-100 shadow-sm">
                <i className="bi bi-file-earmark-text fs-1 text-primary"></i>
                <h5 className="mt-3">Easy Invoice Creation</h5>
                <p className="text-muted">Generate professional invoices in minutes with our user-friendly interface.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="p-4 border rounded text-center h-100 shadow-sm">
                <i className="bi bi-cloud-download fs-1 text-success"></i>
                <h5 className="mt-3">Download as PDF</h5>
                <p className="text-muted">Export and download invoices in high-quality PDF format anytime.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="p-4 border rounded text-center h-100 shadow-sm">
                <i className="bi bi-speedometer2 fs-1 text-danger"></i>
                <h5 className="mt-3">Real-time Dashboard</h5>
                <p className="text-muted">Track paid and pending invoices with a live statistics dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">© 2025 Invoice Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
