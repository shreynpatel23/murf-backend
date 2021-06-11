const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const compression = require("compression");
const ForumController = require("./routes/forum");
const PostController = require("./routes/post");
const ChannelController = require("./routes/channel");
const CommentController = require("./routes/comment");
const AuthController = require("./routes/auth");
const verify = require("./routes/verifyRoutes");

// use this command to configure the dotenv file.
require("dotenv").config();

// use this port variable to map with the PORT variable in the env file.
const port = process.env.PORT || 5000;
// use this variable to connect to the database
const db_url = process.env.ATLAS_URI;

app.use(compression());

// establishing the connection
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on ${port}`);
      // print success message once the connection is established.
      console.log("connection established");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use(AuthController);
app.use("/forums", verify, ForumController);
app.use("/channels", verify, ChannelController);
app.use("/posts", verify, PostController);
app.use("/comments", verify, CommentController);
