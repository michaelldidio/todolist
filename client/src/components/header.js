import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-md my-3">
    <div className="container">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav fw-bold fs-5">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link mx-md-4" to="/addAuctionItem">Add Auction Item</Link>
        </div>
      </div>
    </div>
  </nav>
  );
}
export default Header;