import React, { useState, useEffect } from "react";
import apiService from "../services/api"; // Import the API service
import { useParams, useNavigate } from "react-router-dom";

// Basic validation function (similar to AddMemberPage)
const validateForm = (formData) => {
  const errors = {};
  if (!formData.get("name")) errors.name = "Name is required";
  if (!formData.get("role")) errors.role = "Role is required";
  if (!formData.get("email")) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.get("email"))) {
    errors.email = "Email address is invalid";
  }
  return errors;
};

function EditMemberPage() {
  const [formData, setFormData] = useState({ name: "", role: "", email: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setServerError("");
        const response = await apiService.getMember(id); // Use API service
        setFormData({
          name: response.data.data.name,
          role: response.data.data.role,
          email: response.data.data.email,
        });
        // Note: We don"t pre-fill the file input for security reasons
      } catch (err) {
        console.error("Error fetching member data:", err);
        setServerError("Failed to load member data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

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
      const response = await apiService.updateMember(id, data); // Use API service
      console.log("Member updated:", response.data);
      navigate(`/members/${id}`); // Redirect to the member details page
    } catch (err) {
      console.error("Error updating member:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setServerError(Array.isArray(err.response.data.error) ? err.response.data.error.join(", ") : err.response.data.error);
      } else {
        setServerError("Failed to update member. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <div>
      <h2>Edit Member</h2>
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
          <label htmlFor="profilePicture">Profile Picture (Optional - leave blank to keep current):</label><br />
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Update Member</button>
      </form>
    </div>
  );
}

export default EditMemberPage;

