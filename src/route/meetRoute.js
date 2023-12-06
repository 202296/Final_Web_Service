const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getMeetingById,
    getAllMeetings,
    updateMeeting,
    deleteMeeting,
  } = require('../controller/meetController');
  const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
  const asyncHandler = require('express-async-handler');


// Create a new meeting
router.post('/meetings', authMiddleware, isAdmin, asyncHandler(createMeeting));

// Get a list of all meetings
router.get('/meetings', asyncHandler(getAllMeetings));

// Get a single meeting by ID
router.get('/meetings/:id', asyncHandler(getMeetingById));

// Update a meeting by ID
router.put('/meetings/:id',  authMiddleware, isAdmin, asyncHandler(updateMeeting));

// Delete a meeting by ID
router.delete('/meetings/:id',  authMiddleware, isAdmin, asyncHandler(deleteMeeting));

module.exports = router;
