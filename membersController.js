const Member = require("../models/Member");
const multer = require("multer");
const path = require("path");

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/"); // Ensure this path matches where you want to store uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// @desc    Add a new member
// @route   POST /api/members
// @access  Public
exports.addMember = [upload.single("profilePicture"), async (req, res, next) => {
  try {
    const { name, role, email } = req.body;
    let profilePicturePath = req.file ? `/uploads/${req.file.filename}` : undefined; // Use default if no file uploaded

    const memberData = {
      name,
      role,
      email,
      ...(profilePicturePath && { profilePicture: profilePicturePath }) // Only add profilePicture if it exists
    };

    const member = await Member.create(memberData);

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (err) {
    console.error(err);
    // Handle validation errors specifically
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    // Handle duplicate key error (email)
    if (err.code === 11000) {
        return res.status(400).json({ success: false, error: "Email already exists" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
}];

// @desc    Get all members
// @route   GET /api/members
// @access  Public
exports.getMembers = async (req, res, next) => {
  try {
    const members = await Member.find();
    res.status(200).json({ success: true, count: members.length, data: members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
exports.getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (err) {
    console.error(err);
    // Handle CastError (invalid ObjectId format)
    if (err.name === 'CastError') {
        return res.status(404).json({ success: false, error: "Member not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Public
exports.updateMember = [upload.single("profilePicture"), async (req, res, next) => {
  try {
    let member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
      // Optional: Delete old picture if needed
    }

    member = await Member.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: member });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    if (err.code === 11000) {
        return res.status(400).json({ success: false, error: "Email already exists" });
    }
    if (err.name === 'CastError') {
        return res.status(404).json({ success: false, error: "Member not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
}];

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Public
exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }

    // Optional: Delete profile picture file from server if needed
    // const fs = require('fs');
    // const imagePath = path.join(__dirname, '..', member.profilePicture);
    // if (fs.existsSync(imagePath) && member.profilePicture !== '/uploads/default.png') {
    //   fs.unlinkSync(imagePath);
    // }

    await member.deleteOne(); // Use deleteOne() on the document

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
     if (err.name === 'CastError') {
        return res.status(404).json({ success: false, error: "Member not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

