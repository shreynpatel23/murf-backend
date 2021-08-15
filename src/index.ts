import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import AuthRouter from "./routes/auth.routes";
import ForumRouter from "./routes/forum.routes";
import ChannelRouter from "./routes/channel.routes";
import CommentRouter from "./routes/comment.routes";
import PostRouter from "./routes/post.routes";

// use this command to configure the dotenv file.
dotenv.config();
// use this port variable to map with the PORT variable in the env file.
const port = process.env.PORT || 5000;
// use this variable to connect to the database
const db_url = process.env.ATLAS_URI || "";

const app: Application = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// default route
app.get("/", (_, res) => {
  res.send("Up!");
});
app.use(new AuthRouter().getRouter());
app.use("/forums", new ForumRouter().getRouter());
app.use("/channels", new ChannelRouter().getRouter());
app.use("/posts", new PostRouter().getRouter());
app.use("/comments", new CommentRouter().getRouter());
// handle 404
app.use("*", (_, res) => {
  res.status(404).send({
    err: "That's a bad endpoint",
    data: null,
  });
});

// establishing the connection
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`server is running on ${port}`);
      // print success message once the connection is established.
      console.log("connection established");
    });
  })
  .catch((err) => {
    console.log(err);
  });
