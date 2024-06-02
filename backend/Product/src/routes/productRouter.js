const express = require("express");
const { createProduct, getDetailProduct, deleteProduct, updateProduct, getAllProduct } = require("../controller/productController");
const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProduct)
router.get("/:id", getDetailProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

module.exports = router;
