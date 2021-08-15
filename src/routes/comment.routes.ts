import { Router as ExpressRouter } from "express";
import CommentService from "../controllers/comment.controller";

interface Router {
  getRouter(): ExpressRouter;
}

export default class CommentRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private commentService: CommentService = new CommentService();

  constructor() {
    const { router } = CommentRouter;
    // routes for adding comment.
    router.post("/add-comment", async (req, res) => {
      const { comment, postId } = req.body;
      if (typeof comment !== "string")
        return res
          .status(400)
          .send({ err: "Comment should be a string", data: null });
      if (typeof postId !== "string")
        return res
          .status(400)
          .send({ err: "Post id should be a string", data: null });
      const { err, status, data } = await this.commentService.addComment({
        comment,
        postId,
      });
      res.status(status).send({ err, data });
    });

    // routes for deleting a comment
    router.delete("/:id", async (req, res) => {
      const { id } = req.params;
      const { postId } = req.body;
      if (typeof postId !== "string")
        return res
          .status(400)
          .send({ err: "Post id should be a string", data: null });
      const { err, status, data } = await this.commentService.deleteComment({
        commentId: id,
        postId,
      });
      res.status(status).send({ err, data });
    });
  }

  getRouter(): ExpressRouter {
    return CommentRouter.router;
  }
}
