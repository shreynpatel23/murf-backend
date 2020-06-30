const router = require("express").Router();
const postController = require("../controllers/post");

// routes for getting all Posts.
router.get("/", postController.getAllPosts);

// routes for add a new Post.
router.post("/new-post", postController.addNewPost);

module.exports = router;
