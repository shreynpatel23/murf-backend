const Post = require("../modals/post.modal");
const Forum = require("../modals/forum.modal");
// function to get all post of the forum
exports.getAllPosts = (_, response) => {
  try {
    // the below function returns a promise.
    Post.find()
      .populate("userId")
      .then((post) => {
        response.json(post);
      })
      .catch((err) => response.status(400).json(err));
  } catch (err) {
    response.status(400).json(err);
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

// function for getting all posts of a user based upon userId
exports.getAllPostsOfUser = async (request, response) => {
  const id = request.body.userId;
  try {
    await Post.find({
      userId: id,
    })
      .then((post) => {
        if (post.length !== 0) {
          return response.json(post);
        }
        response.send("no post found for this ID");
      })
      .catch((err) => response.status(400).json(err));
    Post.findById(id);
  } catch (err) {
    response.status(400).json(err);
  }
};

// function for adding a new post
exports.addNewPost = async (request, response) => {
  try {
    // check if the forum exist or not.
    const forumAlreadyExist = await Forum.findOne({
      _id: request.body.forumId,
    });
    if (!forumAlreadyExist)
      return response.status(400).json({ message: "Forum Does not exist" });

    const userId = request.body.userId;
    const forumId = request.body.forumId;
    const headerText = request.body.headerText;
    const bodyText = request.body.bodyText;
    const headerHTML = request.body.headerHTML;
    const bodyHTML = request.body.bodyHTML;
    const tags = request.body.tags;
    const category = request.body.category.toLowerCase();
    const comments = request.body.comments;
    const pinned = request.body.pinned;
    const liked = request.body.liked;
    const saved = request.body.saved;
    const newPost = new Post({
      forumId,
      headerText,
      headerHTML,
      bodyText,
      bodyHTML,
      tags,
      category,
      comments,
      pinned,
      saved,
      liked,
      userId,
    });
    newPost
      .save()
      .then((post) => {
        response.json(post);
      })
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {
    response.status(400).json(err);
  }
};
