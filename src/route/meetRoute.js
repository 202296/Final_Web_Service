const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getMeetingById,
    getAllMeetings,
    updateMeeting,
    deleteMeeting,
  } = require('../controller/meetController');
  const asyncHandler = require('express-async-handler');


// Create a new meeting
router.post('/meetings', asyncHandler(createMeeting));

// Get a list of all meetings
router.get('/meetings', asyncHandler(getAllMeetings));

// Get a single meeting by ID
router.get('/meetings/:id', asyncHandler(getMeetingById));

// Update a meeting by ID
router.put('/meetings/:id', asyncHandler(updateMeeting));

// Delete a meeting by ID
router.delete('/meetings/:id', asyncHandler(deleteMeeting));

module.exports = router;
