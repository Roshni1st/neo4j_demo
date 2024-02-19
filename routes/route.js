const express = require("express");
const router = express.Router();
const driver = require("../models/connection");
const USER = require("../controllers/user");

router.get("/all", USER.all);
router.post("/create", USER.create);
router.put("/update/:id", USER.update);
router.delete("/:id", USER.remove);

module.exports = router;
