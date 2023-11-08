const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
        type: String,
        required: true,
      },
    publishedYear: {
        type: String,
        required: true,
      },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    pages: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    tags: String,
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Book", bookSchema);