const router = require("express").Router();
const commentController = require("../controllers/comment");

// routes for adding comment.
router.post("/add-comment", commentController.addComment);

module.exports = router;
