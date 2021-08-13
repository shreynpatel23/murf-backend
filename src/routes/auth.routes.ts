import { Router as ExpressRouter } from "express";
import { BadRequest } from "../common/responses";
import AuthService from "../controllers/auth.controller";

interface Router {
  getRouter(): ExpressRouter;
}

export default class AuthRouter implements Router {
  private static router: ExpressRouter = ExpressRouter();
  private authService: AuthService = new AuthService();

  constructor() {
    const { router } = AuthRouter;

    // route for sign in using google
    router.post("/sign-in-using-google", async (req, res) => {
      const { user_email, user_name, imageUrl } = req.body;
      if (typeof user_email !== "string")
        return res
          .status(400)
          .send({ err: "Email should be string", data: null });
      if (typeof user_name !== "string")
        return res
          .status(400)
          .send({ err: "Name should be string", data: null });
      if (typeof imageUrl !== "string")
        return res
          .status(400)
          .send({ err: "Image url should be string", data: null });
      const { err, data, status } = await this.authService.signUpUsingGoogle({
        user_email,
        user_name,
        imageUrl,
      });
      res.status(status).send({ err, data });
    });

    // route for login using google
    router.post("/login-using-google", async (req, res) => {
      const { user_email } = req.body;
      if (typeof user_email !== "string")
        return res
          .status(400)
          .send({ err: "Email should be string", data: null });
      const { err, status, data } = await this.authService.loginUsingGoogle({
        user_email,
      });
      res.status(status).send({ err, data });
    });

    // route for manual login
    router.post("/login", async (req, res) => {
      const { user_email, password } = req.body;
      if (typeof user_email !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Email should be string" });
      if (typeof password !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Password should be string" });

      const { err, data, status } = await this.authService.manualLogin({
        user_email,
        password,
      });
      res.status(status).send({ err, data });
    });

    // route for manual sign up
    router.post("/sign-up", async (req, res) => {
      const { user_email, user_name, password } = req.body;
      if (typeof user_email !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Email should be string" });
      if (typeof password !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Password should be string" });
      if (typeof user_name !== "string")
        return res
          .status(400)
          .send({ err: "Name should be string", data: null });

      const { err, data, status } = await this.authService.createUser(
        {
          user_email,
          user_name,
          password,
        },
        req
      );
      res.status(status).send({ err, data });
    });

    // route for resend verification link
    router.post("/resend-verification-link", async (req, res) => {
      const { user_email } = req.body;
      if (typeof user_email !== "string")
        return res
          .status(400)
          .send({ data: null, err: "Email should be string" });

      const { err, status, data } =
        await this.authService.resendVerificationLink({ user_email }, req);
      res.status(status).send({ err, data });
    });
    // route for verifying email
    router.get("/verify/:token", async (req, res) => {
      const { err, status, data } = await this.authService.verifyUserEmail(
        req,
        res
      );
      res.status(status).send({ err, data });
    });
  }

  getRouter(): ExpressRouter {
    return AuthRouter.router;
  }
}
