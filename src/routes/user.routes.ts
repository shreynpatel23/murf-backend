import { Router as ExpressRouter } from "express";
import UserService from "../controllers/user.controller";
import verify from "./verifyRoutes";

interface Router {
  getRouter(): ExpressRouter;
}

export class UserRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private userService: UserService = new UserService();

  constructor() {
    const { router } = UserRouter;
    // routes for getting user info
    router.get("/:id", verify, async (req, res) => {
      const { id } = req.params;
      const { err, status, data } = await this.userService.getUserInfo({
        userId: id,
      });
      res.status(status).send({ err, data });
    });

    // routes for getting all forum of users
    router.get("/:id/forums", verify, async (req, res) => {
      const { id } = req.params;
      const { err, status, data } = await this.userService.getAllForumOfUser({
        userId: id,
      });
      res.status(status).send({ err, data });
    });
  }

  getRouter(): ExpressRouter {
    return UserRouter.router;
  }
}
