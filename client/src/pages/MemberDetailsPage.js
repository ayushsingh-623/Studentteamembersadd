import React, { useState, useEffect } from "react";
import apiService from "../services/api"; // Import the API service
import { useParams, Link, useNavigate } from "react-router-dom";

function MemberDetailsPage() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiService.getMember(id); // Use API service
        setMember(response.data.data);
      } catch (err) {
        console.error("Error fetching member details:", err);
        if (err.response && err.response.status === 404) {
          setError("Member not found.");
        } else {
          setError("Failed to fetch member details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await apiService.deleteMember(id); // Use API service
        navigate("/members"); // Redirect to members list after deletion
      } catch (err) {
        console.error("Error deleting member:", err);
        setError("Failed to delete member. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading member details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!member) return <p>Member not found.</p>; // Should be covered by error state, but good practice

  return (
    <div>
      <h2>Member Details</h2>
      <div style={{ border: "1px solid #555", padding: "20px", borderRadius: "5px", background: "#444", maxWidth: "500px", margin: "auto" }}>
        <img 
          src={`http://localhost:5000${member.profilePicture}`} 
          alt={`${member.name}"s profile`} 
          style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", marginBottom: "20px", display: "block", marginLeft: "auto", marginRight: "auto" }}
          onError={(e) => { e.target.onerror = null; e.target.src="/path/to/default/image.png" }} // Basic error handling
        />
        <h3>{member.name}</h3>
        <p><strong>Role:</strong> {member.role}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Joined:</strong> {new Date(member.createdAt).toLocaleDateString()}</p>
        <div style={{ marginTop: "20px" }}>
          <Link to={`/edit/${member._id}`}>
            <button style={{ marginRight: "10px" }}>Edit Member</button>
          </Link>
          <button onClick={handleDelete} style={{ backgroundColor: "#dc3545", color: "white" }}>Delete Member</button>
        </div>
      </div>
      <Link to="/members" style={{ display: "block", marginTop: "20px" }}>Back to Members List</Link>
    </div>
  );
}

export default MemberDetailsPage;

