const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Member = require('../models/Member');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json({ data: members });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching members' });
  }
});

// Get a single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching member' });
  }
});

// Add a new member
router.post('/', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    const member = new Member({
      name,
      role,
      email,
      profilePicture
    });

    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Error adding member' });
  }
});

// Update a member
router.put('/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const updateData = { name, role, email };

    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: 'Error updating member' });
  }
});

// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting member' });
  }
});

module.exports = router; 