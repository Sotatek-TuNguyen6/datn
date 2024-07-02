const express = require("express");
const { createProduct, getDetailProduct, deleteProduct, updateProduct, getAllProduct, importData, getProductByCategory } = require("../controller/productController");
const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProduct)
router.get("/:id", getDetailProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.post("/importData", importData)
router.get("/category/:id", getProductByCategory)
module.exports = router;
