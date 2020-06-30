const router = require("express").Router();
const ForumController = require("../controllers/forum");

// routes for getting all forum.
router.get("/", ForumController.getAllForums);

// routes for get forum by ID.
router.get("/:id", ForumController.getForumById);

// routes for add a new forum.
router.post("/new-forum", ForumController.addNewForum);

module.exports = router;
