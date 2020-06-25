const router = require("express").Router();
let Forum = require("../modals/forum.modal");
// use the verify method to check for the auth-token token.
const verify = require("../controller/verifyRoutes");

router.route("/").get(verify, (_, response) => {
  // the below function returns a promise.
  Forum.find()
    .then((forum) => response.json(forum))
    .catch((err) => response.json(err));
});

router.route("/new-forum").post(verify, async (request, response) => {
  try {
    const forumName = request.body.forumName;
    // create a new forum object with the new forum name.
    const newForum = await new Forum({ forumName });
    // use the new forum object to save the data in the database
    newForum
      .save()
      .then((forum) => response.json(forum))
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {
    response.status(400).json(err);
  }
});

module.exports = router;
