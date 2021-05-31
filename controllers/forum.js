const Forum = require("../modals/forum.modal");
const Channel = require("../modals/channel.modal");
const User = require("../modals/user.modal");
const defaultChannels = ["General", "Announcements", "News"];

// Get forum by id controller
exports.getForumById = (request, response) => {
  try {
    const id = request.params.id;
    Forum.findById(id)
      .populate("userId")
      .then((forum) => response.json(forum))
      .catch(() => response.status(400).json({ message: "Forum not found" }));
  } catch (err) {
    response.status(400).json(err);
  }
};

// Add new forum controller
exports.createForum = async (request, response) => {
  try {
    // check if the forum already exist or not.
    const forumAlreadyExist = await Forum.findOne({
      forum_name: request.body.forum_name,
    });
    if (forumAlreadyExist)
      return response.status(400).json({ message: "Forum name already exist" });

    // create default channels for the forum.
    const default_channels = defaultChannels.map((channel_name) => {
      return new Channel({
        channel_name: channel_name,
      });
    });

    // create a new forum object with the new forum name.
    const newForum = new Forum({
      forum_name: request.body.forum_name,
      theme: request.body.theme,
      userId: request.body.userId,
      channels: default_channels,
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
