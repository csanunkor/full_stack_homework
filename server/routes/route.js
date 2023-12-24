const router = require("express").Router();
const { readFile, getFileTree } = require("../controller/controller.js");

router.get("/readfile", readFile);
router.get("/filetree", getFileTree);

module.exports = router;
