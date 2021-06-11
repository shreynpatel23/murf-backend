const Post = require("../modals/post.modal");
const Forum = require("../modals/forum.modal");
const Channel = require("../modals/channel.modal");
const Comment = require("../modals/comment.modal");

// function for getting all post of a channel
exports.getAllPostOfChannel = async (request, response) => {
  try {
    const channelId = request.baseUrl.split("/")[4];
    Post.find({ channelId: channelId })
      .then((channel) => response.json(channel))
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
            Channel.findById(channelId).then((channel) => {
              const postIds = channel.postIds;
              channel.postIds = [...postIds, post._id];
              channel.save();
            });
            const updatedChannels = forum.channels.map((channel) => {
              if (channel._id == channelId) {
                const postIds = channel.postIds;
                return { ...channel, postIds: [...postIds, post._id] };
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
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {
    response.status(400).json(err);
  }
};

// function to like a post
exports.likePost = async (request, response) => {
  try {
    Post.findById(request.params.id)
      .then((post) => {
        const { isLiked } = request.body;
        let count = post.liked.count;
        if (isLiked && !post.liked.isLiked) {
          post.liked = { ...post.liked, isLiked: isLiked, count: count + 1 };
          response.json(post.liked);
        } else if (!isLiked && post.liked.isLiked) {
          post.liked = { ...post.liked, isLiked: isLiked, count: count - 1 };
          response.json(post.liked);
        } else {
          response.status(400).json({ message: "Something went wrong" });
        }
        post.save();
      })
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {
    response.status(400).json(err);
  }
};

// function to add a comment
exports.addComment = async (request, response) => {
  try {
    const postId = request.params.id;
    const { comment } = request.body;
    Post.findById(postId)
      .then(async (post) => {
        const new_comment = await new Comment({
          comment: comment,
          postId: post._id,
          replies: [],
        })
          .save()
          .then((comment) => {
            response.json(comment);
            post.comments = [...post.comments, comment._id];
            post.save();
          })
          .catch(() =>
            response.status(400).json({ message: "Cannot post your comment" })
          );
      })
      .catch((err) => response.status(400).json(err));
  } catch (err) {
    response.status(400).json(err);
  }
};
