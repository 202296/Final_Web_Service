const mongoose = require("mongoose"); // Erase if already required

const reviewSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    book: {
      type: String,
      required: true,
    },
    tags: String,
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ]
  },
  { timestamps: true }
    
);


// Export the models
module.exports = mongoose.model("Review", reviewSchema);
