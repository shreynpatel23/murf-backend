const router = require("express").Router();
const ForumController = require("../controllers/forum");

// routes for get forum by ID.
router.get("/:id", ForumController.getForumById);

// routes for add a new forum.
router.post("/create-forum", ForumController.createForum);

module.exports = router;
