import { BadRequest, IResponse, OkResponse } from "../common/responses";
import Channel, { IChannelSchema } from "../modals/channel";
import Forum, { IForumSchema } from "../modals/forum";
import Post, { IPostSchema } from "../modals/post";

export default class ChannelService {
  // function for getting all post of a channel
  async getAllPostOfChannel(data: { channelId: string }): Promise<IResponse> {
    try {
      const posts: IPostSchema[] = await Post.find({
        channelId: data.channelId,
      }).populate({ path: "userId", select: ["imageUrl", "name"] });
      return OkResponse(posts);
    } catch (err) {
      return BadRequest(err.message);
    }
  }
  // // Add new channel for a forum
  async createChannel(data: {
    channel_name: string;
    forumId: string;
  }): Promise<IResponse> {
    try {
      const newChannel: IChannelSchema = await await new Channel({
        channel_name: data.channel_name,
        forumId: data.forumId,
      }).save();
      const forum: IForumSchema = await Forum.findById(data.forumId);
      if (!forum) return BadRequest("Forum Id not found");
      if (forum.channels.length >= 10)
        return BadRequest("Only 10 channels are allowed in a forum");
      forum.channels = [...forum.channels, newChannel];
      forum.save();
      return OkResponse(forum.channels);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // Delete a channel from a forum
  async deleteChannel(data: {
    channel_name: string;
    forumId: string;
  }): Promise<IResponse> {
    try {
      const forum: IForumSchema = await Forum.findById(data.forumId);
      if (!forum) return BadRequest("Forum not found");
      // check whether channel name is present or not.
      const channel_name_is_present = forum.channels.findIndex(
        (channel) => channel.channel_name === data.channel_name
      );
      if (channel_name_is_present < 0)
        return BadRequest("Channel does not exist");
      // removing the channel and saving the forum document
      forum.channels = forum.channels.filter(
        (channel) => channel.channel_name !== data.channel_name
      );
      forum.save();
      return OkResponse(forum.channels);
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
