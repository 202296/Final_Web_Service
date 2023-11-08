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
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBook);

router.get("/:id", getaBook);

router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateBook);
router.delete("/:id", authMiddleware, isAdmin, deleteBook);

router.get("/", getAllBooks);

module.exports = router;