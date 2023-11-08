const mongoose = require("mongoose");


// Meeting Schema
const meetingSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});


// Export the models

module.exports.Meeting = mongoose.model("Meeting", meetingSchema);
