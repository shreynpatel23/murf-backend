import User, { IUserSchema } from "../modals/user";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.helper";
import bcrypt from "bcryptjs";
import { OkResponse, BadRequest, IResponse } from "../common/responses";
import { Request, Response } from "express";
import { generateEmailValidationUrl } from "../common/urls";

export default class AuthService {
  // function to Sign in using google
  async signUpUsingGoogle(data: {
    user_name: string;
    user_email: string;
    imageUrl: string;
  }): Promise<IResponse> {
    // check if the user already exists
    const user: IUserSchema = await User.findOne({ email: data.user_email });
    if (user) return BadRequest("Email already exists! Try login instead");

    let hashedPassword;
    const token = jwt.sign({ name: data.user_name }, process.env.TOKEN_SECRET);
    // create new random password
    const randomPassword = Math.random().toString(36).substr(2, 8);
    // Send password via email to the user
    // create Dynamic data for the email
    const dynamic_template_date = {
      subject: "Your Default password",
      name: data.user_name,
      password: randomPassword,
    };
    // send email
    sendMail(
      data.user_email,
      dynamic_template_date,
      "d-c8bcca7b513148529e75967a5e00f3ab"
    );
    try {
      // hash the password
      hashedPassword = await bcrypt.hash(randomPassword, 12);
      const token = jwt.sign(
        { email: data.user_email },
        process.env.TOKEN_SECRET
      );

      // create the new user and save in DB
      const newUser: IUserSchema = await new User({
        name: data.user_name,
        email: data.user_email,
        password: hashedPassword,
        isEmailVerified: true,
        imageUrl: data.imageUrl,
      }).save();
      return OkResponse({ ...newUser._doc, token });
    } catch (err) {
      return BadRequest("please provide valid data point");
    }
  }

  // function to login with google
  async loginUsingGoogle(data: { user_email: string }): Promise<IResponse> {
    const user: IUserSchema = await User.findOne({ email: data.user_email });
    if (!user) return BadRequest("No user found");

    try {
      const token = jwt.sign(
        { email: data.user_email },
        process.env.TOKEN_SECRET
      );

      return OkResponse({ ...user._doc, token });
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // // function to login with email and password
  async manualLogin(data: {
    user_email: string;
    password: string;
  }): Promise<IResponse> {
    const user: IUserSchema = await User.findOne({ email: data.user_email });

    // check if email is present or not
    if (!user) return BadRequest("No user found");

    // check if the password hash matches or not
    if (!bcrypt.compareSync(data.password, user.password))
      return BadRequest("Email or password is incorrect!");

    try {
      const token = jwt.sign(
        { email: data.user_email },
        process.env.TOKEN_SECRET
      );
      return OkResponse({ ...user._doc, token });
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // Function for sign up a user
  async createUser(
    data: {
      user_name: string;
      user_email: string;
      password: string;
    },
    request: Request
  ): Promise<IResponse> {
    // check if the user is present or not
    const user: IUserSchema = await User.findOne({ email: data.user_email });
    if (user) return BadRequest("Email already exists! Try login instead");

    try {
      // hash the password here
      const hashedPassword = await await bcrypt.hash(data.password, 12);

      // Create a new user and save in the DB
      const newUser: IUserSchema = await new User({
        name: data.user_name,
        email: data.user_email,
        password: hashedPassword,
        isEmailVerified: false,
        imageUrl: "",
      }).save();
      const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET);
      const url = generateEmailValidationUrl(request, newUser._id);
      // create Dynamic data for the email
      const dynamic_template_date = {
        subject: "Email Verification",
        name: newUser.name,
        redirect_url: url,
      };
      // send email
      sendMail(
        newUser.email,
        dynamic_template_date,
        "d-7477f4e6aaa4487aaf575433da69bf61"
      );
      return OkResponse({ ...newUser._doc, token });
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to resend verification link to user
  async resendVerificationLink(
    data: {
      user_email: string;
    },
    request: Request
  ): Promise<IResponse> {
    // getting the user who requested the verification link
    const user: IUserSchema = await User.findOne({ email: data.user_email });

    // check whether the user exist or not
    if (!user) return BadRequest("No user found");

    try {
      // check if the user is already verified
      if (user.isEmailVerified) return BadRequest("user is already verified");
      // generating the url
      const url = generateEmailValidationUrl(request, user._id);
      // create Dynamic data for the email
      const dynamic_template_date = {
        subject: "Email Verification",
        name: user.name,
        redirect_url: url,
      };
      // sending mail
      sendMail(
        user.email,
        dynamic_template_date,
        "d-7477f4e6aaa4487aaf575433da69bf61"
      );
      // sending response
      return OkResponse("Email Sent");
    } catch (err) {
      return BadRequest(err.message);
    }
  }

  // function to verify the email of the customer
  async verifyUserEmail(
    request: Request,
    response: Response
  ): Promise<IResponse> {
    try {
      const { token } = request.params;
      const { id, expires } = jwt.verify(token, process.env.TOKEN_SECRET);
      // Check whether expiry time is less than current time
      // if less than we will show that Link is expired
      const current_date = new Date();
      const url = process.env.MURF_FRONTEND_HOST;
      if (expires < current_date.getTime()) {
        response.redirect(
          `${url}/email-not-verified?err=Link Expired!&status=400&data=null`
        );
        return BadRequest("Email Not Verified");
      }
      // else will verify the users email.
      const user: IUserSchema = await User.findOne({ _id: id });
      user.isEmailVerified = true;
      response.redirect(
        `${url}/login?err=null&status=200&data=Email Verified!`
      );
      user.save();
      return OkResponse("Email Verified");
    } catch (err) {
      return BadRequest(err.message);
    }
  }
}
