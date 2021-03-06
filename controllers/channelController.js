const Forum = require("../modals/forum.modal");
const Channel = require("../modals/channel.modal");
const Post = require("../modals/post.modal");

// function for getting all post of a channel
exports.getAllPostOfChannel = async (request, response) => {
  try {
    const { id } = request.params;
    Post.find({ channelId: id })
      .populate({ path: "userId", select: ["imageUrl", "name"] })
      .then((channel) => response.json(channel))
      .catch(() => response.status(400).json({ message: "channel not found" }));
  } catch (err) {
    response.status(400).json(err.message);
  }
};

// Add new channel for a forum
exports.createCustomChannel = async (request, response) => {
  try {
    const channels = [];
    await new Channel({
      channel_name: request.body.channel_name,
      forumId: request.body.forumId,
    })
      .save()
      .then((channel) => channels.push(channel))
      .catch(() =>
        response.status(400).json({ message: "Error in creating a channel" })
      );
    await Forum.findById(request.body.forumId)
      .then((forum) => {
        if (forum.channels.length >= 10) {
          return response
            .status(400)
            .json("Only 10 channels are allowed in a forum");
        }
        forum.channels = [...forum.channels, ...channels];
        forum.save().then((forum) => response.json(forum.channels));
      })
      .catch(() =>
        response.status(400).json({ message: "Forum Id not found" })
      );
  } catch (err) {
    response.status(400).json(err);
  }
};

// Delete a channel from a forum
exports.deleteChannel = async (request, response) => {
  try {
    Forum.findById(request.body.forumId)
      .then((forum) => {
        // check whether channel name is present or not.
        const channel_name_is_present = forum.channels.findIndex(
          (channel) => channel.channel_name === request.body.channel_name
        );
        if (channel_name_is_present < 0) {
          return response
            .status(400)
            .json({ message: "Channel does not exist" });
        }
        // removing the channel and saving the forum document
        const filteredChannels = forum.channels.filter(
          (channel) => channel.channel_name !== request.body.channel_name
        );
        forum.channels = filteredChannels;
        forum.save().then((forum) => response.json(forum.channels));
      })
      .catch(() =>
        response.status(400).json({ message: "Forum Id not found" })
      );
  } catch (err) {
    response.status(400).json(err);
  }
};
