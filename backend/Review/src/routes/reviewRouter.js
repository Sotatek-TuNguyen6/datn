const express = require("express");
const { createReview, getAllReviews, getReview, updateReview, deleteReview } = require("../controller/reviewController");
const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews)
router.get("/:id", getReview);
router.delete("/:id", updateReview);
router.put("/:id", deleteReview);

module.exports = router;
