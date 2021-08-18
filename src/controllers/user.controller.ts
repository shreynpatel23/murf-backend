import { BadRequest, IResponse, OkResponse } from "../common/responses";
import Forum, { IForumSchema } from "../modals/forum";
import User, { IUserSchema } from "../modals/user";

export default class UserService {
  // function to ge the user info
  async getUserInfo(data: { userId: string }): Promise<IResponse> {
    try {
      const user: IUserSchema = await User.findById(data.userId);
      if (!user) return BadRequest("User not found");
      return OkResponse(user);
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to get the list of forum for a user
  async getAllForumOfUser(data: { userId: string }): Promise<IResponse> {
    try {
      const user: IUserSchema = await User.findById(data.userId);
      if (!user) return BadRequest("User not found");
      const forums: IForumSchema[] = [];
      await Promise.all(
        user.forumId.map(async (id: string) => {
          const forum: IForumSchema = await Forum.findById(id).select(
            "_id forum_name theme createdBy createdAt users channels"
          );
          forums.push(forum);
        })
      );
      return OkResponse(forums);
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
