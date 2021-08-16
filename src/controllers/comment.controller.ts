import { Types } from "mongoose";
import { BadRequest, IResponse, OkResponse } from "../common/responses";
import Comment, { ICommentSchema } from "../modals/comment";
import Post, { IPostSchema } from "../modals/post";

export default class CommentService {
  // function to add a comment
  async addComment(data: { comment: string; postId: string }) {
    if (!data && (!data.comment || !data.postId))
      return BadRequest("All fields are required");

    // find post from given post id
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("Cannot post your comment as post not found");

    try {
      // create a new comment and save in db
      const newComment: ICommentSchema = await new Comment({
        comment: data.comment,
        postId: data.postId,
        replies: [],
      });
      newComment.save();
      post.comments = [...post.comments, newComment._id];
      post.save();
      return OkResponse(newComment);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to delete a comment
  async deleteComment(data: {
    commentId: string;
    postId: string;
  }): Promise<IResponse> {
    if (!data && !data.commentId) return BadRequest("All fields are required");

    // find post from given post id
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("Cannot post your comment as post not found");

    // check if the comment is present or not
    const comment: ICommentSchema = await Comment.findById(data.commentId);
    if (!comment) return BadRequest("Comment not found");

    try {
      // get all comments
      const comments: ICommentSchema[] = await Comment.find({
        postId: data.postId,
      });
      // get the deleted comment
      const deletedComment: ICommentSchema = await Comment.findOneAndDelete({
        _id: data.commentId,
      });

      // remove comment from post
      post.comments = post.comments.filter(
        (commentId: Types.ObjectId) =>
          commentId.toString() !== deletedComment._id.toString()
      );
      post.save();

      // filter the comments
      const filteredComments = comments.filter(
        (comment: ICommentSchema) =>
          comment._id.toString() !== deletedComment._id.toString()
      );
      return OkResponse(filteredComments);
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
