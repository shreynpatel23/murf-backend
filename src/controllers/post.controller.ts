import { BadRequest, IResponse, OkResponse } from "../common/responses";
import Comment, { ICommentSchema } from "../modals/comment";
import Post, { IPostSchema } from "../modals/post";

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
}
// // function for getting a particular post by ID
// exports.getPostById = (request, response) => {
//   try {
//     const id = request.params.id;
//     Post.findById(id)
//       .populate({ path: "userId", select: ["imageUrl", "name"] })
//       .then((post) => response.json(post))
//       .catch((err) => response.json(err));
//   } catch (err) {
//     response.status(400).json(err);
//   }
// };

// // function for adding a new post
// exports.createNewPost = async (request, response) => {
//   try {
//     const { forumId, channelId } = request.body;
//     // check if the forum exist or not.
//     const forumAlreadyExist = await Forum.findById(forumId);

//     if (!forumAlreadyExist)
//       return response.status(400).json({ message: "Forum Does not exist" });

//     Forum.findById(forumId)
//       .then((forum) => {
//         const {
//           userId,
//           headerText,
//           bodyText,
//           headerHTML,
//           bodyHTML,
//           tags,
//           comments,
//           pinned,
//           liked,
//           saved,
//         } = request.body;
//         const newPost = new Post({
//           forumId,
//           headerText,
//           headerHTML,
//           bodyText,
//           bodyHTML,
//           tags,
//           comments,
//           pinned,
//           saved,
//           liked,
//           userId,
//           channelId,
//         });
//         newPost
//           .save()
//           .then((post) => {
//             response.json(post);
//             Channel.findById(channelId).then((channel) => {
//               const postIds = channel.postIds;
//               channel.postIds = [...postIds, post._id];
//               channel.save();
//             });
//             const updatedChannels = forum.channels.map((channel) => {
//               if (channel._id == channelId) {
//                 const postIds = channel.postIds;
//                 return { ...channel, postIds: [...postIds, post._id] };
//               }
//               return channel;
//             });
//             forum.channels = updatedChannels;
//             forum.save();
//           })
//           .catch((err) => response.status(400).json(err.message));
//       })
//       .catch(() => response.status(400).json({ message: "channel not found" }));
//   } catch (err) {
//     response.status(400).json(err);
//   }
// };

// // function to update a post
// exports.updatePost = async (request, response) => {
//   try {
//     Post.findById(request.params.id)
//       .then((post) => {
//         const { headerText, bodyText, tags, headerHTML, bodyHTML } =
//           request.body;
//         post.headerText = headerText;
//         post.headerHTML = headerHTML;
//         post.bodyText = bodyText;
//         post.bodyHTML = bodyHTML;
//         post.tags = tags;
//         post.save();
//         response.json(post);
//       })
//       .catch(() =>
//         response.status(400).json(getErrorResponse("Post not found"))
//       );
//   } catch (err) {
//     response.status(400).json(err);
//   }
// };

// //function to pin a post
// exports.pinPost = async (request, response) => {
//   try {
//     Post.findById(request.params.id)
//       .then((post) => {
//         const { pin } = request.body;
//         post.pinned = pin;
//         post.save();
//         response.json(getSuccessResponse(post.pinned));
//       })
//       .catch(() =>
//         response.status(400).json(getErrorResponse("Post not found"))
//       );
//   } catch (err) {
//     response.status(400).json(err);
//   }
// };

// //function to save a post
// exports.savePost = async (request, response) => {
//   try {
//     Post.findById(request.params.id)
//       .then((post) => {
//         const { save } = request.body;
//         post.saved = save;
//         post.save();
//         response.json(getSuccessResponse(post.saved));
//       })
//       .catch(() =>
//         response.status(400).json(getErrorResponse("Post not found"))
//       );
//   } catch (err) {
//     response.status(400).json(err);
//   }
// };

// // function to like a post
// exports.likePost = async (request, response) => {
//   try {
//     Post.findById(request.params.id)
//       .then((post) => {
//         const { isLiked } = request.body;
//         let count = post.liked.count;
//         if (isLiked && !post.liked.isLiked) {
//           post.liked = { ...post.liked, isLiked: isLiked, count: count + 1 };
//           response.json(post.liked);
//         } else if (!isLiked && post.liked.isLiked) {
//           post.liked = { ...post.liked, isLiked: isLiked, count: count - 1 };
//           response.json(post.liked);
//         } else {
//           response.status(400).json({ message: "Something went wrong" });
//         }
//         post.save();
//       })
//       .catch((err) => response.status(400).json(err.message));
//   } catch (err) {
//     response.status(400).json(err);
//   }
// };
