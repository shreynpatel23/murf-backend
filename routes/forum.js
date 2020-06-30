const router = require("express").Router();
const ForumController = require("../controllers/forum");

// routes for getting all forum.
router.get("/", ForumController.getAllForums);

// routes for add a new forum.
router.post("/new-forum", ForumController.addNewForum);

module.exports = router;
