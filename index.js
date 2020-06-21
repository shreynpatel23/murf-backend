const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const ForumController = require("./controller/forum");
const PostController = require("./controller/post");

// use this command to configure the dotenv file.
require("dotenv").config();

// use this port variable to map with the PORT variable in the env file.
const port = process.env.PORT || 5000;
// use this variable to connect to the database
const db_url = process.env.ATLAS_URI;
// use this variable to establish the connection.
const connection = mongoose.connection;

// establishing the connection
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// print success message once the connection is established.
connection.once("open", () => {
  console.log("connection established");
});

app.use(cors());
app.use(express.json());

app.use("/forum", ForumController);
app.use("/post", PostController);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
