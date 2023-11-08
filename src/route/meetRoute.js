const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getMeetingById,
    getAllMeetings,
    updateMeeting,
    deleteMeeting,
  } = require('../controller/meetController');

// Create a new meeting
router.post('/meetings', createMeeting);

// Get a list of all meetings
router.get('/meetings', getAllMeetings);

// Get a single meeting by ID
router.get('/meetings/:id', getMeetingById);

// Update a meeting by ID
router.put('/meetings/:id', updateMeeting);

// Delete a meeting by ID
router.delete('/meetings/:id', deleteMeeting);

module.exports = router;
