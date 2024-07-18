const express = require("express");
const ShippingController = require("../controller/shippingController")

const router = express.Router();

router.post("/", ShippingController.createShipping);
router.get("/", ShippingController.getAllShippings);
router.get("/:id", ShippingController.getShippingById);
router.put("/:id", ShippingController.updateShippingById);
router.delete("/:id", ShippingController.deleteShippingById);
// router.post("/importData", importData)
module.exports = router;
