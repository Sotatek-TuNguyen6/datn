const express = require("express");
const { createAction, genrenterAction } = require("../controller/actionController");
const router = express.Router();

router.post("/", createAction);
router.post("/genrenterAction", genrenterAction);


module.exports = router;
