import { BadRequest, IResponse, OkResponse } from "../common/responses";
import jwt from "jsonwebtoken";
import Forum, { IForumSchema } from "../modals/forum";
import Channel, { IChannelSchema } from "../modals/channel";
import User, { IUserSchema } from "../modals/user";
import { Request, Response } from "express";
import { addMemberViaEmail } from "../common/urls";
import { sendMail } from "../utils/mail.helper";

const defaultChannels = ["General", "Announcements", "News"];

export default class ForumService {
  // Get forum by id controller
  async getForumById(request: Request): Promise<IResponse> {
    try {
      const id = request.params.id;
      const forum: IForumSchema = await Forum.findById(id);
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

    // find the user details from the users collection;
    const user: IUserSchema = await User.findById(data.userId);
    if (!user) return BadRequest("User not found! Please create and account");

    try {
      // create a new forum object with the new forum name.
      const newForum: IForumSchema = await new Forum({
        forum_name: data.forum_name,
        theme: data.theme,
      });
      // update the created By object
      newForum.createdBy = { name: user.name, email: user.email, Id: user._id };
      newForum.userId = [user._id.toString()];
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
      await newForum.save();
      return OkResponse(newForum);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to invite a member via email
  async inviteMemberToForum(
    data: { user_email: string; forum_id: string; invited_by: string },
    request: Request
  ): Promise<IResponse> {
    const user: IUserSchema = await User.findById(data.invited_by);
    if (!user) return BadRequest("No user found");

    const forum: IForumSchema = await Forum.findById(data.forum_id);
    if (!forum) return BadRequest("Forum does not exist");

    try {
      // generate the email data and shoot the email
      const url = addMemberViaEmail(request, data.user_email, data.forum_id);
      // create Dynamic data for the email
      const dynamic_template_date = {
        subject: "Invite Member",
        forum_name: forum.forum_name,
        invited_by: user.name,
        redirect_url: url,
      };
      // send email
      sendMail(
        data.user_email,
        dynamic_template_date,
        "d-de9178ad1fdb4fbe996a8507b0d3af6f"
      );
      return OkResponse("Email sent");
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // verify token for member invite email
  async verifyTokenToAddMember(
    request: Request,
    response: Response
  ): Promise<IResponse> {
    try {
      const { token, forum_id } = request.params;
      const { id, expires } = jwt.verify(token, process.env.TOKEN_SECRET);
      // Check whether expiry time is less than current time
      // if less than we will show that Link is expired
      const current_date = new Date();
      if (expires < current_date.getTime()) {
        response.redirect(
          "http://localhost:4000/email-not-verified?err=Link Expired!&status=400&data=null"
        );
        return BadRequest("Link Expired");
      }
      // else will verify the users email.
      const user: IUserSchema = await User.findOne({ email: id });
      if (!user) {
        response.redirect("http://localhost:4000/sign-up");
        return BadRequest("User does not exist! please sign up");
      }

      // find the forum to update the urserId Array
      const forum: IForumSchema = await Forum.findById(forum_id);
      if (forum.userId.includes(user._id.toString()))
        return BadRequest("User already added in the forum");
      forum.userId.push(user._id.toString());
      forum.save();
      return OkResponse("User Added Successfully");
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to get all the members of a forum
  async getAllMembersOfForum(data: { forumId: string }): Promise<IResponse> {
    const forum: IForumSchema = await Forum.findById(data.forumId);
    if (!forum) return BadRequest("Forum not found");
    let users: IUserSchema[] = [];
    try {
      await Promise.all(
        forum.userId.map(async (userId: string) => {
          const user: IUserSchema = await User.findById(userId).select(
            "name email imageUrl _id"
          );
          users.push(user);
        })
      );
      return OkResponse(users);
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
