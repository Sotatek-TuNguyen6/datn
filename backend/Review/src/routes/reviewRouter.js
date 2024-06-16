const express = require("express");
const { createReview, getAllReviews, getReview, updateReview, deleteReview, getReviewByProduct } = require("../controller/reviewController");
const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews)
router.get("/:id", getReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
router.get("/product/:product", getReviewByProduct)
module.exports = router;
