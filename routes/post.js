const router = require("express").Router();
const postController = require("../controllers/post");

// routes for get forum by ID.
router.get("/:id", postController.getPostById);

// routes for add a new Post.
router.post("/new-post", postController.addNewPost);

// routes for getting all posts of a user.
router.post("/get-posts", postController.getAllPostsOfUser);

module.exports = router;
