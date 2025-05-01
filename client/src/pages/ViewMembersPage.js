import React, { useState, useEffect } from "react";
import apiService from "../services/api"; // Import the API service
import MemberCard from "../components/MemberCard"; // Import the actual MemberCard component

import { Link } from "react-router-dom"; // Keep Link import

function ViewMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getMembers(); // Use API service
      setMembers(response.data.data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to fetch members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handler for deleting a member
  const handleDeleteMember = async (id) => {
    try {
      await apiService.deleteMember(id);
      // Refetch members list after deletion
      fetchMembers(); 
    } catch (err) {
      console.error("Error deleting member:", err);
      setError("Failed to delete member. Please try again.");
      // Optionally clear the error after some time
    }
  };

  return (
    <div>
      <h2>Team Members</h2>
      {loading && <p>Loading members...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}> {/* Adjusted minmax for better spacing */}
          {members.length > 0 ? (
            members.map((member) => (
              <MemberCard 
                key={member._id} 
                member={member} 
                onDelete={handleDeleteMember} // Pass delete handler
              />
            ))
          ) : (
            <p>No members found. <Link to="/add">Add one!</Link></p>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewMembersPage;

