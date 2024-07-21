const express = require("express");
const ShippingController = require("../controller/shippingController");
const { protect } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/", ShippingController.createShipping);
router.get("/", protect, ShippingController.getAllShippings);
router.get("/:id", ShippingController.getShippingById);
router.put("/:id", ShippingController.updateShippingById);
router.delete("/:id", protect, ShippingController.deleteShippingById);
// router.post("/importData", importData)
module.exports = router;
