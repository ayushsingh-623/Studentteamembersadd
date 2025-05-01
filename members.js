const express = require("express");
const {
  getMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
} = require("../controllers/membersController");

const router = express.Router();

// Route for getting all members and adding a new member
router.route("/").get(getMembers).post(addMember);

// Route for getting, updating, and deleting a single member by ID
router.route("/:id").get(getMember).put(updateMember).delete(deleteMember);

module.exports = router;

