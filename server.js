const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_team_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Student Team Management API Running');
});

const memberRoutes = require("./routes/members");
app.use("/api/members", memberRoutes);

// Use a different port if 5000 is in use
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

