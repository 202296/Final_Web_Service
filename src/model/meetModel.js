const mongoose = require("mongoose");

var meetingSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String, 
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  attendees: [
    { type: mongoose.Schema.ObjectId, ref: "User" }
  ],
});

module.exports = mongoose.model("Meeting", meetingSchema);
