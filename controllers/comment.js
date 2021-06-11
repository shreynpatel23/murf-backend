const Comment = require("../modals/comment.modal");
const Post = require("../modals/post.modal");

// function to add a comment
exports.addComment = async (request, response) => {
  try {
    const { comment, postId } = request.body;
    Post.findById(postId)
      .then(async (post) => {
        await new Comment({
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
