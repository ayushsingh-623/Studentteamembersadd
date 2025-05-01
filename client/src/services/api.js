import axios from "axios";

// Define the base URL for the API
const API_URL = "http://localhost:5001/api/members"; // Updated port number

// Create an Axios instance (optional, but good practice for setting defaults)
const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get all members
export const getMembers = () => apiService.get("/");

// Function to get a single member by ID
export const getMember = (id) => apiService.get(`/${id}`);

// Function to add a new member (handles multipart/form-data)
export const addMember = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Function to update a member (handles multipart/form-data)
export const updateMember = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Function to delete a member by ID
export const deleteMember = (id) => apiService.delete(`/${id}`);

// Export the configured instance if needed elsewhere, or just the functions
export default {
  getMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
};

