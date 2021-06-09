const router = require("express").Router();
const postController = require("../controllers/post");

// routes for getting all posts from a channel
router.get("/", postController.getAllPostOfChannel);

// routes for post by id.
router.get("/:id", postController.getPostById);

// routes for add a new Post.
router.post("/create-post", postController.createNewPost);

// routes for updating a post.
router.put("/:id/update-post", postController.updatePost);

module.exports = router;
