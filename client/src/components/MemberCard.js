import React from "react";
import { Link } from "react-router-dom";

function MemberCard({ member, onDelete }) { // Added onDelete prop
  // Construct the image URL correctly, assuming backend runs on localhost:5000
  const imageUrl = member.profilePicture 
    ? `http://localhost:5000${member.profilePicture}` 
    : "/path/to/default/image.png"; // Fallback default image

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      onDelete(member._id);
    }
  };

  return (
    <div style={cardStyle}>
      <img 
        src={imageUrl} 
        alt={`${member.name}"s profile`} 
        style={imageStyle}
        // Basic error handling for image load
        onError={(e) => { 
          e.target.onerror = null; // Prevent infinite loop if default also fails
          e.target.src="/path/to/default/image.png"; 
        }}
      />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      <div style={buttonContainerStyle}>
        <Link to={`/members/${member._id}`}>
          <button style={buttonStyle}>View Details</button>
        </Link>
        <Link to={`/edit/${member._id}`}>
          <button style={{...buttonStyle, marginLeft: "5px"}}>Edit</button>
        </Link>
        {/* Add Delete button - requires passing onDelete handler from parent */}
        <button onClick={handleDeleteClick} style={{...buttonStyle, marginLeft: "5px", backgroundColor: "#dc3545", color: "white" }}>Delete</button>
      </div>
    </div>
  );
}

// Basic styles for dark theme
const cardStyle = {
  border: "1px solid #555",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  background: "#3a3a3a", // Darker card background
  color: "#e0e0e0", // Lighter text
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
};

const imageStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "10px",
  border: "2px solid #555"
};

const buttonContainerStyle = {
  marginTop: "15px"
};

const buttonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#555", // Darker button
  color: "white"
};

export default MemberCard;

