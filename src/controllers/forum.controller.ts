import { BadRequest, IResponse, OkResponse } from "../common/responses";
import Forum, { IForumSchema } from "../modals/forum";
import Channel, { IChannelSchema } from "../modals/channel";
import User from "../modals/user";
import { Request } from "express";

const defaultChannels = ["General", "Announcements", "News"];

export default class ForumService {
  // Get forum by id controller
  async getForumById(request: Request): Promise<IResponse> {
    try {
      const id = request.params.id;
      const forum: IForumSchema = await Forum.findById(id).populate({
        path: "userId",
        select: ["imageUrl", "email", "name"],
      });
      if (!forum) return BadRequest("Forum not found");
      return OkResponse(forum);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // Add new forum controller
  async createForum(data: {
    forum_name: string;
    theme: string;
    userId: string;
  }): Promise<IResponse> {
    // check if the forum already exist or not.
    const forumAlreadyExist = await Forum.findOne({
      forum_name: data.forum_name,
    });
    if (forumAlreadyExist) return BadRequest("Forum already exist");

    try {
      // create a new forum object with the new forum name.
      const newForum: IForumSchema = await new Forum({
        forum_name: data.forum_name,
        theme: data.theme,
        userId: data.userId,
      });
      let channels: IChannelSchema[] = [];
      // create default channels for the forum.
      await Promise.all(
        defaultChannels.map(async (channel_name) => {
          const channel: IChannelSchema = await new Channel({
            channel_name: channel_name,
            forumId: newForum._id,
          }).save();
          channels.push(channel);
        })
      );
      // use the new forum object to save the data in the database
      newForum.channels = channels;
      newForum.save();
      // updating the user schema with forum id.
      const user = await User.findById(data.userId);
      user.forumId = newForum._id;
      user.save();
      return OkResponse(newForum);
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
