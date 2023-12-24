const express = require("express");
const router = express.Router();

//handles CRUD operations for user data
router.route("/").get().post().patch().delete();

module.exports = router;
