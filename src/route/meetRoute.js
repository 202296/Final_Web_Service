const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// Create a new meeting
router.post('/meetings', meetingController.createMeeting);

// Get a list of all meetings
router.get('/meetings', meetingController.getAllMeetings);

// Get a single meeting by ID
router.get('/meetings/:id', meetingController.getMeetingById);

// Update a meeting by ID
router.put('/meetings/:id', meetingController.updateMeeting);

// Delete a meeting by ID
router.delete('/meetings/:id', meetingController.deleteMeeting);

module.exports = router;
