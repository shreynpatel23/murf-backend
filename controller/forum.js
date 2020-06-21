const router = require("express").Router();
let Forum = require("../modals/forum.modal");

router.route("/").get((_, response) => {
  // the below function returns a promise.
  Forum.find()
    .then((forum) => response.json(forum))
    .catch((err) => response.json(err));
});

router.route("/new-forum").post((request, response) => {
  const forumName = request.body.forumName;
  // create a new forum object with the new forum name.
  const newForum = new Forum({ forumName });
  // use the new forum object to save the data in the database
  newForum
    .save()
    .then((forum) => response.json(forum))
    .catch((err) => response.json(err));
});

module.exports = router;
