import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.header("authToken");
  if (!token) return response.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    response.locals.jwt = verified;
    next();
  } catch (err) {
    response.status(400).send("invalid Token");
  }
}
