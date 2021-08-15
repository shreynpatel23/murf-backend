import { Router as ExpressRouter } from "express";
import ChannelService from "../controllers/channel.controller";
import verify from "./verifyRoutes";

interface Router {
  getRouter(): ExpressRouter;
}

export default class ChannelRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private channelService: ChannelService = new ChannelService();

  constructor() {
    const { router } = ChannelRouter;
    // routes for getting all posts from a channel
    router.get("/:id/posts", verify, async (req, res) => {
      const { id } = req.params;
      const { err, status, data } =
        await this.channelService.getAllPostOfChannel({ channelId: id });
      res.status(status).send({ err, data });
    });

    // routes for creating a channel
    router.post("/create-channel", async (req, res) => {
      const { channel_name, forumId } = req.body;
      if (typeof channel_name !== "string")
        return res
          .status(400)
          .send({ err: "Channel name should be a string", data: null });
      if (typeof forumId !== "string")
        return res
          .status(400)
          .send({ err: "Forum id should be a string", data: null });
      const { err, data, status } = await this.channelService.createChannel({
        channel_name,
        forumId,
      });
      res.status(status).send({ err, data });
    });

    // routes for deleting a channel
    router.delete("/delete-channel", async (req, res) => {
      const { channel_name, forumId } = req.body;
      if (typeof channel_name !== "string")
        return res
          .status(400)
          .send({ err: "Channel name should be a string", data: null });
      if (typeof forumId !== "string")
        return res
          .status(400)
          .send({ err: "Forum id should be a string", data: null });
      const { err, data, status } = await this.channelService.deleteChannel({
        channel_name,
        forumId,
      });
      res.status(status).send({ err, data });
    });
  }

  getRouter(): ExpressRouter {
    return ChannelRouter.router;
  }
}
