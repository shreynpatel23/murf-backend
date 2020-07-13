const Post = require("../modals/post.modal");

exports.getAllPosts = (_, response) => {
  try {
    // the below function returns a promise.
    Post.find()
      .then((forum) => response.json(forum))
      .catch((err) => response.status(400).json(err));
  } catch (err) {
    response.status(400).json(err);
  }
};

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

exports.addNewPost = async (request, response) => {
  try {
    const userId = request.body.userId;
    const headerText = request.body.headerText;
    const bodyText = request.body.bodyText;
    const tags = request.body.tags;
    const category = request.body.category;
    const comments = request.body.comments;
    const postedBy = request.body.postedBy;
    const pinned = request.body.pinned;
    const saved = request.body.saved;
    const liked = request.body.liked;
    const newPost = new Post({
      headerText,
      bodyText,
      tags,
      category,
      comments,
      postedBy,
      pinned,
      saved,
      liked,
      userId,
    });

    newPost
      .save()
      .then((post) => response.json(post))
      .catch((err) => response.status(400).json(err.message));
  } catch (err) {
    response.status(400).json(err);
  }
};
