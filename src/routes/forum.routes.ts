import { Router as ExpressRouter } from "express";
import ForumService from "../controllers/forum.controller";
import verify from "../routes/verifyRoutes";

interface Router {
  getRouter(): ExpressRouter;
}

export default class ForumRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private forumService: ForumService = new ForumService();

  constructor() {
    const { router } = ForumRouter;
    // routes for get forum by ID.
    router.get("/:id", verify, async (req, res) => {
      const { err, status, data } = await this.forumService.getForumById(req);
      res.status(status).send({ err, data });
    });

    // routes for add a new forum.
    router.post("/create-forum", verify, async (req, res) => {
      const { forum_name, theme, userId } = req.body;
      if (typeof forum_name !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Forum name should be string" });
      if (typeof theme !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Theme should be string" });
      if (typeof userId !== "string")
        return res
          .status(400)
          .send({ data: null, err: "User_id should be string" });

      const { err, status, data } = await this.forumService.createForum({
        forum_name,
        theme,
        userId,
      });
      res.status(status).send({ err, data });
    });
  }
  getRouter(): ExpressRouter {
    return ForumRouter.router;
  }
}
