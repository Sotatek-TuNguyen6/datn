const express = require("express");
const { createAction, genrenterAction } = require("../controller/actionController");
const router = express.Router();

router.post("/", createAction);
router.get("/genrenterAction", genrenterAction);


module.exports = router;
