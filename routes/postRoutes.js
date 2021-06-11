const router = require("express").Router();
const postController = require("../controllers/postController");

// routes for post by id.
router.get("/:id", postController.getPostById);

// routes for add a new Post.
router.post("/create-post", postController.createNewPost);

// routes for updating a post.
router.put("/:id/update-post", postController.updatePost);

// routes for liking a post.
router.put("/:id/like", postController.likePost);

//routes for getting all comments of the post
router.get("/:id/comments", postController.getAllComments);

module.exports = router;
