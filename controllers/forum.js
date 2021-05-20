const Forum = require("../modals/forum.modal");
const Posts = require("../modals/post.modal");
const User = require("../modals/user.modal");

// Get all forum controller
exports.getAllForums = (_, response) => {
  // the below function returns a promise.
  Forum.find()
    .then((forum) => response.json(forum))
    .catch((err) => response.json(err));
};

// Get forum by id controller
exports.getForumById = (request, response) => {
  try {
    const id = request.params.id;
    Forum.findById(id)
      .populate("userId")
      .then((forum) => response.json(forum))
      .catch((err) => response.json(err));
  } catch (err) {
    response.status(400).json(err);
  }
};

// Add new forum controller
exports.addNewForum = async (request, response) => {
  try {
    // check if the forum already exist or not.
    const forumAlreadyExist = await Forum.findOne({
      forumName: request.body.forumName,
    });
    if (forumAlreadyExist)
      return response.status(400).json({ message: "Forum name already exist" });

    // create a new forum object with the new forum name.
    const newForum = new Forum({
      forumName: request.body.forumName,
      theme: request.body.theme,
      userId: request.body.userId,
    });
    // use the new forum object to save the data in the database
    newForum
      .save()
      .then((forum) => response.json(forum))
      .catch((err) => response.status(400).json(err.message));
    // updating the user schema with forum id.
    User.findById(request.body.userId)
      .then((user) => {
        user.forumId = newForum._id;
        return user.save();
      })
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {
    response.status(400).json(err);
  }
};

// update a forum controller
// exports.updateForum = (request, response) => {
//   const userName = request.body.userName;
//   const theme = request.body.theme;
//   try {
// Forum.findById(request.params.id)
//   .then((forum) => {
//     forum.userName = userName;
//     forum.theme = theme;
//     return forum.save();
//   })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((err) => response.status(400).json(err.message));
//   } catch (err) {}
// };

// get all posts for forum
exports.getAllPostForForum = (request, response) => {
  const id = request.params.id;
  try {
    Posts.find({
      forumId: id,
    })
      .populate("userId")
      .then((posts) => response.json(posts))
      .catch((err) => response.json(err));
  } catch (err) {
    response.status(400).json(err);
  }
};
