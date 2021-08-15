import { Router as ExpressRouter } from "express";
import PostService from "../controllers/post.controller";

interface Router {
  getRouter(): ExpressRouter;
}

export default class PostRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private postService: PostService = new PostService();

  constructor() {
    const { router } = PostRouter;
    //routes for getting all comments of the post
    router.get("/:id/comments", async (req, res) => {
      const { id } = req.params;
      const { err, status, data } = await this.postService.getAllCommentsOfPost(
        { postId: id }
      );
      res.status(status).send({ err, data });
    });
  }

  getRouter(): ExpressRouter {
    return PostRouter.router;
  }
}

// const router = require("express").Router();
// const postController = require("../controllers/postController");

// // routes for post by id.
// router.get("/:id", postController.getPostById);

// // routes for add a new Post.
// router.post("/create-post", postController.createNewPost);

// // routes for updating a post.
// router.put("/:id/update-post", postController.updatePost);

// // routes for pining a post.
// router.put("/:id/pin-post", postController.pinPost);

// // routes for saving a post.
// router.put("/:id/save-post", postController.savePost);

// // routes for liking a post.
// router.put("/:id/like", postController.likePost);
