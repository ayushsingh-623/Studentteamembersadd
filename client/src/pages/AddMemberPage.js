import React, { useState } from "react";
import apiService from "../services/api"; // Import the API service
import { useNavigate } from "react-router-dom";

// Basic validation function
const validateForm = (formData) => {
  const errors = {};
  if (!formData.get("name")) errors.name = "Name is required";
  if (!formData.get("role")) errors.role = "Role is required";
  if (!formData.get("email")) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.get("email"))) {
    errors.email = "Email address is invalid";
  }
  // Add more validation rules if needed
  return errors;
};

function AddMemberPage() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Clear previous server errors

    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("email", formData.email);
    if (file) {
      data.append("profilePicture", file);
    }

    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await apiService.addMember(data);
      console.log("Member added:", response.data);
      navigate("/members"); // Redirect to the view members page after successful addition
    } catch (err) {
      console.error("Error adding member:", err);
      if (err.response && err.response.data && err.response.data.error) {
        // Handle specific errors from backend (like duplicate email)
        setServerError(Array.isArray(err.response.data.error) ? err.response.data.error.join(", ") : err.response.data.error);
      } else {
        setServerError("Failed to add member. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Add New Member</h2>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="name">Name:</label><br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red", margin: "0" }}>{errors.name}</p>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="role">Role:</label><br />
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          {errors.role && <p style={{ color: "red", margin: "0" }}>{errors.role}</p>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red", margin: "0" }}>{errors.email}</p>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="profilePicture">Profile Picture:</label><br />
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
}

export default AddMemberPage;

