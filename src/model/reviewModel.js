const mongoose = require("mongoose");

// Review Schema
var reviewSchema = new mongoose.Schema({
  book: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  comment: String,
  date: String,
  likes: Number,
  dislikes: Number,
  tags: [String]
});

// Export the models
module.exports.Review = mongoose.model("Review", reviewSchema);
