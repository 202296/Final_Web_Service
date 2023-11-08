const Meeting = require('../models/meeting'); // Import the Meeting model

// Create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the meeting.' });
  }
};

// Get a list of all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching meetings.' });
  }
};

// Get a single meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the meeting.' });
  }
};

// Update a meeting by ID
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the meeting.' });
  }
};

// Delete a meeting by ID
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndRemove(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the meeting.' });
  }
};
