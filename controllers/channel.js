const Forum = require("../modals/forum.modal");
const Channel = require("../modals/channel.modal");

// Add new channel for a forum
exports.createCustomChannel = async (request, response) => {
  try {
    const newCustomChannel = new Channel({
      channel_name: request.body.channel_name,
    });
    console.log(request.body.forumId);
    Forum.findById(request.body.forumId)
      .then((forum) => {
        if (forum.channels.length >= 10) {
          return response
            .status(400)
            .json("Only 5 custom channels are allowed in a forum");
        }
        const channels = forum.channels;
        forum.channels = [...channels, newCustomChannel];
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
