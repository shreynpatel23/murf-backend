import { BadRequest, IResponse, OkResponse } from "../common/responses";
import Channel, { IChannelSchema } from "../modals/channel";
import Comment, { ICommentSchema } from "../modals/comment";
import Forum, { IForumSchema } from "../modals/forum";
import Post, { IPostSchema, Liked } from "../modals/post";

export default class PostService {
  // function to get all comments of post
  async getAllCommentsOfPost(data: { postId: string }): Promise<IResponse> {
    if (!data && !data.postId) return BadRequest("All fields are required");

    // find post from given post id
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("Cannot post your comment as post not found");

    try {
      const comments: ICommentSchema[] = await Comment.find({
        postId: data.postId,
      });
      return OkResponse(comments);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to get post by id
  async getPostById(data: { postId: string }): Promise<IResponse> {
    if (!data && !data.postId) return BadRequest("All fields are required");

    try {
      const post: IPostSchema = await Post.findById(data.postId).populate({
        path: "userId",
        select: ["imageUrl", "name"],
      });
      if (!post)
        return BadRequest("The post you are looking for is not present");
      return OkResponse(post);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to create a post
  async createPost(data: {
    forumId: string;
    headerText: string;
    headerHTML: string;
    bodyText: string;
    bodyHTML: string;
    tags: Array<string>;
    comments: Array<string>;
    pinned: boolean;
    saved: boolean;
    liked: Liked;
    userId: string;
    channelId: string;
  }): Promise<IResponse> {
    // check if the forum exist or not.
    const forum: IForumSchema = await Forum.findById(data.forumId);

    if (!forum) return BadRequest("Forum Does not exist");

    try {
      // create the post and save it in db
      const newPost: IPostSchema = await new Post(data).save();
      // update the post id in channel
      const channel: IChannelSchema = await Channel.findById(data.channelId);
      // throw error if channel is not found
      if (!channel) return BadRequest("Channel not found");
      // update post id in the channel and save it in db
      channel.postIds = [...channel.postIds, newPost._id];
      channel.save();

      // check whether the given channel id is present in forum or not
      const channelIdsOfForum: string[] = forum.channels.map((channel) =>
        channel._id.toString()
      );
      if (!channelIdsOfForum.includes(data.channelId))
        return BadRequest("Channel does not exist in forum");
      // update the channels in forum
      const updatedChannels: any = forum.channels.map((channel) => {
        if (channel._id.toString() === data.channelId) {
          const postIds = channel.postIds;
          return { ...channel, postIds: [...postIds, newPost._id] };
        }
        return channel;
      });
      forum.channels = updatedChannels;
      forum.save();
      return OkResponse(newPost);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to update a post
  async updatePost(data: {
    headerText: string;
    bodyText: string;
    tags: Array<string>;
    headerHTML: string;
    bodyHTML: string;
    postId: string;
  }): Promise<IResponse> {
    // check if post is present or not
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("The post you are looking for is not present");

    try {
      post.headerText = data.headerText;
      post.headerHTML = data.headerHTML;
      post.bodyText = data.bodyText;
      post.bodyHTML = data.bodyHTML;
      post.tags = data.tags;
      post.save();
      return OkResponse(post);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to pin a post
  async pinPost(data: { postId: string; pin: boolean }): Promise<IResponse> {
    if (!data && (!data.postId || !data.pin))
      return BadRequest("All fields are required");
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("The post you are looking for is not present");
    try {
      post.pinned = data.pin;
      post.save();
      return OkResponse(post);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to save a post
  async savePost(data: { postId: string; save: boolean }): Promise<IResponse> {
    if (!data && (!data.postId || !data.save))
      return BadRequest("All fields are required");
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("The post you are looking for is not present");
    try {
      post.saved = data.save;
      post.save();
      return OkResponse(post);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to like a post
  async likePost(data: {
    postId: string;
    isLiked: boolean;
  }): Promise<IResponse> {
    if (!data && (!data.postId || !data.isLiked))
      return BadRequest("All fields are required");
    const post: IPostSchema = await Post.findById(data.postId);
    if (!post) return BadRequest("The post you are looking for is not present");
    try {
      let count = post.liked.count;
      if (data.isLiked && !post.liked.isLiked) {
        post.liked = { ...post.liked, isLiked: data.isLiked, count: count + 1 };
        post.save();
        return OkResponse(post);
      } else if (!data.isLiked && post.liked.isLiked) {
        post.liked = { ...post.liked, isLiked: data.isLiked, count: count - 1 };
        post.save();
        return OkResponse(post);
      } else {
        return BadRequest("Something went wrong");
      }
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
