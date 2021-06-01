const Post = require("../modals/post.modal");
const Forum = require("../modals/forum.modal");
const Channel = require("../modals/channel.modal");

// function for getting all post of a channel
exports.getAllPostOfChannel = async (request, response) => {
  try {
    const forumId = request.baseUrl.split("/")[2];
    const channelId = request.baseUrl.split("/")[4];
    Forum.findById(forumId)
      .then((forum) => {
        const channel = forum.channels.find((channel) => {
          return channel._id == channelId;
        });
        response.json(channel.posts);
      })
      .catch(() => response.status(400).json({ message: "channel not found" }));
  } catch (err) {
    response.status(400).json(err.message);
  }
};

// function for getting a particular post by ID
exports.getPostById = (request, response) => {
  try {
    const id = request.params.id;
    Post.findById(id)
      .then((post) => response.json(post))
      .catch((err) => response.json(err));
  } catch (err) {
    response.status(400).json(err);
  }
};

// function for adding a new post
exports.createNewPost = async (request, response) => {
  try {
    const forumId = request.baseUrl.split("/")[2];
    const channelId = request.baseUrl.split("/")[4];
    // check if the forum exist or not.
    const forumAlreadyExist = await Forum.findById(forumId);

    if (!forumAlreadyExist)
      return response.status(400).json({ message: "Forum Does not exist" });

    Forum.findById(forumId)
      .then((forum) => {
        const {
          userId,
          headerText,
          bodyText,
          headerHTML,
          bodyHTML,
          tags,
          comments,
          pinned,
          liked,
          saved,
        } = request.body;
        const newPost = new Post({
          forumId,
          headerText,
          headerHTML,
          bodyText,
          bodyHTML,
          tags,
          comments,
          pinned,
          saved,
          liked,
          userId,
          channelId,
        });
        newPost
          .save()
          .then((post) => {
            response.json(post);
            const updatedChannels = forum.channels.map((channel) => {
              if (channel._id == channelId) {
                const posts = channel.posts;
                return { ...channel, posts: [...posts, post] };
              }
              return channel;
            });
            forum.channels = updatedChannels;
            forum.save();
          })
          .catch((err) => response.status(400).json(err.message));
      })
      .catch(() => response.status(400).json({ message: "channel not found" }));
  } catch (err) {
    response.status(400).json(err);
  }
};

// function to update a post
exports.updatePost = async (request, response) => {
  try {
    Post.findById(request.params.id)
      .then((post) => {
        const { headerText, bodyText, tags } = request.body;
        post.headerText = headerText;
        post.bodyText = bodyText;
        post.tags = tags;
        post.save();
        response.json(post);
      })
      .then((result) => {
        response.json(result);
      })
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {}
};
