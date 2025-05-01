const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "Please add a role"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  profilePicture: {
    type: String, // Store the path to the image
    default: "/uploads/default.png", // Optional: add a default image path
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Member", MemberSchema);

