const Meeting = require('../model/meetModel'); // Import the Meeting model
const asyncHandler = require("express-async-handler");

// Create a new meeting
const createMeeting = asyncHandler( async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the meeting.' });
  }
});

// Get a list of all meetings
const getAllMeetings = asyncHandler(async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching meetings.' });
  }
});

// Get a single meeting by ID
const getMeetingById = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the meeting.' });
  }
});

// Update a meeting by ID
const updateMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the meeting.' });
  }
});

// Delete a meeting by ID
const deleteMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndRemove(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the meeting.' });
  }
});


module.exports = {
  createMeeting,
  getMeetingById,
  getAllMeetings,
  updateMeeting,
  deleteMeeting,
};