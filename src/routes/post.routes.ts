import { Router as ExpressRouter } from "express";
import PostService from "../controllers/post.controller";
import { Liked } from "../modals/post";
import verify from "./verifyRoutes";

interface Router {
  getRouter(): ExpressRouter;
}

export default class PostRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private postService: PostService = new PostService();

  constructor() {
    const { router } = PostRouter;
    //routes for getting all comments of the post
    router.get("/:id/comments", verify, async (req, res) => {
      const { id } = req.params;
      const { err, status, data } = await this.postService.getAllCommentsOfPost(
        { postId: id }
      );
      res.status(status).send({ err, data });
    });

    // routes for post by id.
    router.get("/:id", verify, async (req, res) => {
      const { id } = req.params;
      const { err, status, data } = await this.postService.getPostById({
        postId: id,
      });
      res.status(status).send({ err, data });
    });

    // routes for add a new Post.
    router.post("/create-post", verify, async (req, res) => {
      const post: {
        forumId: string;
        headerText: string;
        headerHTML: string;
        bodyText: string;
        bodyHTML: string;
        tags: Array<string>;
        comments: Array<string>;
        pinned: boolean;
        saved: boolean;
        liked: Liked;
        userId: string;
        channelId: string;
      } = req.body;
      const { err, status, data } = await this.postService.createPost(post);
      res.status(status).send({ err, data });
    });

    // routes for updating a post.
    router.put("/:id/update-post", verify, async (req, res) => {
      const { id } = req.params;
      const post: {
        headerText: string;
        bodyText: string;
        tags: Array<string>;
        headerHTML: string;
        bodyHTML: string;
        userId: string;
      } = req.body;
      const { err, data, status } = await this.postService.updatePost({
        ...post,
        postId: id,
      });
      res.status(status).send({ err, data });
    });

    // routes for pining a post.
    router.put("/:id/pin-post", verify, async (req, res) => {
      const { id } = req.params;
      const { pin } = req.body;
      if (typeof pin !== "boolean")
        return res
          .status(400)
          .send({ err: "Pin value should be boolean", data: null });
      const { err, status, data } = await this.postService.pinPost({
        postId: id,
        pin,
      });
      res.status(status).send({ err, data });
    });

    // routes for saving a post.
    router.put("/:id/save-post", verify, async (req, res) => {
      const { id } = req.params;
      const { save } = req.body;
      if (typeof save !== "boolean")
        return res
          .status(400)
          .send({ err: "Save value should be boolean", data: null });
      const { err, status, data } = await this.postService.savePost({
        postId: id,
        save,
      });
      res.status(status).send({ err, data });
    });

    // routes for liking a post.
    router.put("/:id/like", verify, async (req, res) => {
      const { id } = req.params;
      const { isLiked } = req.body;
      console.log(isLiked);
      if (typeof isLiked !== "boolean")
        return res
          .status(400)
          .send({ err: "Like should be boolean", data: null });
      const { err, status, data } = await this.postService.likePost({
        postId: id,
        isLiked,
      });
      res.status(status).send({ err, data });
    });
  }

  getRouter(): ExpressRouter {
    return PostRouter.router;
  }
}
