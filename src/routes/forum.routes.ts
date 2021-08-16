import { request, Router as ExpressRouter } from "express";
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

    // routes for inviting a user in a forum
    router.post("/invite-member", verify, async (req, res) => {
      const { user_email, forum_id, invited_by } = req.body;
      if (typeof user_email !== "string")
        return res
          .status(400)
          .send({ err: "Email should be a string", data: null });
      if (typeof forum_id !== "string")
        return res
          .status(400)
          .send({ err: "Forum name should be a string", data: null });
      if (typeof invited_by !== "string")
        return res
          .status(400)
          .send({ err: "Invited by should be a string", data: null });
      const { err, status, data } = await this.forumService.inviteMemberToForum(
        { user_email, invited_by, forum_id },
        req
      );
      res.status(status).send({ err, data });
    });

    // routes for verifying email token
    router.get("/invite-member/:token/:forum_id", verify, async (req, res) => {
      const { err, data, status } =
        await this.forumService.verifyTokenToAddMember(req, res);
      res.status(status).send({ err, data });
    });

    // routes for getting all users of a forum
    router.get("/:id/members", verify, async (req, res) => {
      const { id } = req.params;
      const { err, data, status } =
        await this.forumService.getAllMembersOfForum({ forumId: id });
      res.status(status).send({ err, data });
    });
  }
  getRouter(): ExpressRouter {
    return ForumRouter.router;
  }
}
