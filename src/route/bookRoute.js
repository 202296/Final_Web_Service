const express = require("express");
const {
  createBook,
  getaBook,
  getAllBooks,
  updateBook,
  deleteBook,
  rating,
} = require("../controller/bookController");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.post("/", authMiddleware, isAdmin, asyncHandler(createBook));

router.get("/:id", asyncHandler(getaBook));

router.put("/rating", authMiddleware, asyncHandler(rating));

router.put("/:id", authMiddleware, isAdmin, asyncHandler(updateBook));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(deleteBook));

router.get("/", asyncHandler(getAllBooks));

module.exports = router;