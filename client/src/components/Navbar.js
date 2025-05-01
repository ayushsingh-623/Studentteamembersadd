import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/add" style={linkStyle}>Add Member</Link>
      <Link to="/members" style={linkStyle}>View Members</Link>
    </nav>
  );
}

// Basic styles for dark theme navbar
const navStyle = {
  background: "#282c34", // Dark background
  padding: "15px 20px",
  marginBottom: "30px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
};

const linkStyle = {
  color: "#61dafb", // React blue for links
  marginRight: "20px",
  textDecoration: "none",
  fontSize: "1.1em"
};

export default Navbar;

