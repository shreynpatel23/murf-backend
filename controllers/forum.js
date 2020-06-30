const Forum = require("../modals/forum.modal");

exports.getAllForums = (_, response) => {
  // the below function returns a promise.
  Forum.find()
    .then((forum) => response.json(forum))
    .catch((err) => response.json(err));
};

exports.addNewForum = async (request, response) => {
  try {
    // check if the forum already exist or not.
    const forumAlreadyExist = await Forum.findOne({
      forumName: request.body.forumName,
    });
    if (forumAlreadyExist)
      return response.status(400).json({ message: "Forum name already exist" });

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
};
