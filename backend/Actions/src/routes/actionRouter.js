const express = require("express");
const { createAction } = require("../controller/actionController");
const router = express.Router();

router.post("/", createAction);


module.exports = router;
