import React from "react";
import { Link } from "react-router-dom";
import { SignedOut, useClerk, UserButton,SignedIn} from "@clerk/clerk-react";
const Menubar = () => {
  const { openSignIn } = useClerk();
  const openLogin=()=>{
    openSignIn();
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container py-2 d-flex justify-content-between align-items-center">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Invoice Generator
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Links */}
        <div className="collapse navbar-collapse animate__animated animate__fadeIn" id="navbarNav">
<SignedIn>
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/generate">Generate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/preview">Preview</Link>
            </li>
          </ul>
          <UserButton className="ms-lg-4 mt-3 mt-lg-0" />
</SignedIn>

          {/* Auth Buttons */}
          <SignedOut>
          <div className="ms-lg-4 mt-3 mt-lg-0 d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary btn-sm px-3" onClick={openLogin}>Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm px-3" onClick={openLogin}>Sign Up</Link>
          </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
