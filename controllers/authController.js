const User = require("../modals/user.modal");
const jwt = require("jsonwebtoken");
const mail = require("../utils/mail.helper");
const bcrypt = require("bcryptjs");
const { getSuccessResponse } = require("../utils/successResponse");
const { getErrorResponse } = require("../utils/errorResponse");

function getFullHostURL(req) {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host");
  return `${protocol}://${host}`;
}

// function to generate email verification url
function generateEmailValidationUrl(req, id) {
  const url = getFullHostURL(req);
  const current_date = new Date();
  const expiry_time = current_date.getTime() + 30 * 60 * 1000; // 30 minutes
  const email_token = jwt.sign(
    { id: id, expires: expiry_time },
    process.env.TOKEN_SECRET
  );
  return `${url}/verify/${email_token}`;
}

// function to Sign in using google
exports.signInUsingGoogle = async (request, response) => {
  const { user_name, user_email, imageUrl } = request.body;
  const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);
  // check if the user already exists
  const user = await User.findOne({ email: user_email });
  let hashedPassword;
  if (user)
    return response
      .status(400)
      .send(getErrorResponse("Email already exists! Try login instead"));
  try {
    // create new random password
    const randomPassword = Math.random().toString(36).substr(2, 8);
    // Send password via email to the user
    // create Dynamic data for the email
    const dynamic_template_date = {
      subject: "Your Default password",
      name: user_name,
      password: randomPassword,
    };
    // send email
    mail.sendMail(
      user_email,
      dynamic_template_date,
      "d-c8bcca7b513148529e75967a5e00f3ab"
    );
    // hash the password
    await bcrypt
      .hash(randomPassword, 12)
      .then((password) => (hashedPassword = password));

    // create the new user and save in DB
    const newUser = new User({
      name: user_name,
      email: user_email,
      password: hashedPassword,
      isEmailVerified: true,
      imageUrl: imageUrl,
    });
    newUser
      .save()
      .then((res) => {
        response.header("authToken", token);
        const { _id, name, email, imageUrl, isEmailVerified } = res;
        response.json(
          getSuccessResponse({
            name,
            email,
            imageUrl,
            _id,
            token,
            isEmailVerified,
          })
        );
      })
      .catch((err) => {
        response.status(400).json(getErrorResponse(err.message));
      });
  } catch (err) {
    response
      .status(400)
      .json(getErrorResponse("please provide valid data point"));
  }
};

// function to login with google
exports.loginUsingGoogle = async (request, response) => {
  const { user_email } = request.body;
  const user = await User.findOne({ email: user_email });
  if (!user)
    return response.status(400).json(getErrorResponse("No user found"));
  try {
    const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);
    const { name, email, imageUrl, _id, isEmailVerified, forumId } = user._doc;
    return response.send(
      getSuccessResponse({
        name,
        email,
        imageUrl,
        _id,
        token,
        isEmailVerified,
        forumId,
      })
    );
  } catch (err) {
    response.status(400).json(getErrorResponse(err.message));
  }
};

// function to check the login Functionality
exports.getUser = async (request, response) => {
  const { user_email, password } = request.body;
  const user = await User.findOne({ email: user_email });

  // check if email is present or not
  if (!user)
    return response.status(400).json(getErrorResponse("No user found"));

  // check if the password hash matches or not
  if (!bcrypt.compareSync(password, user.password))
    return response
      .status(400)
      .json(getErrorResponse("Email or password is incorrect!"));

  try {
    const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);
    const { name, email, imageUrl, _id, isEmailVerified, forumId } = user._doc;
    return response.status(200).send(
      getSuccessResponse({
        name,
        email,
        imageUrl,
        _id,
        token,
        isEmailVerified,
        forumId,
      })
    );
  } catch (err) {
    response.status(400).json(getErrorResponse(err.message));
  }
};

// Function for sign up a user
exports.createUser = async (request, response) => {
  const { user_name, user_email, password } = request.body;

  // check if the user is present or not
  const user = await User.findOne({ email: user_email });
  if (user)
    return response
      .status(400)
      .send(getErrorResponse("Email already exists! Try login instead"));

  try {
    let hashedPassword;
    // hash the password here
    await bcrypt
      .hash(password, 12)
      .then((password) => (hashedPassword = password))
      .catch((err) => console.log(err));

    // Create a new user and save in the DB
    const newUser = new User({
      name: user_name,
      email: user_email,
      password: hashedPassword,
      isEmailVerified: false,
      imageUrl: "",
    });
    newUser
      .save()
      .then(async (res) => {
        const token = jwt.sign({ id: res._id }, process.env.TOKEN_SECRET);
        const { _id, name, email, imageUrl, isEmailVerified } = res;
        response.header("authToken", token);
        const data = generateEmailValidationUrl(request, _id);
        // create Dynamic data for the email
        const dynamic_template_date = {
          subject: "Email Verification",
          name: name,
          redirect_url: data,
        };
        // send email
        mail.sendMail(
          email,
          dynamic_template_date,
          "d-7477f4e6aaa4487aaf575433da69bf61"
        );
        response.json(
          getSuccessResponse({
            name,
            email,
            imageUrl,
            _id,
            token,
            isEmailVerified,
          })
        );
      })
      .catch((err) => {
        response.status(400).json(getErrorResponse(err.message));
      });
  } catch (err) {
    response
      .status(400)
      .json(getErrorResponse("please provide valid data point"));
  }
};

// function to resend verification link to user
exports.resendVerificationLink = async (request, response) => {
  const { user_email } = request.body;
  // getting the user who requested the verification link
  const user = User.findOne({ email: user_email });

  // check whether the user exist or not
  if (!user)
    return response.status(400).json(getErrorResponse("No user found"));

  try {
    user
      .then((user) => {
        // check if the user is already verified
        if (user.isEmailVerified)
          return response
            .status(400)
            .json(getErrorResponse("user is already verified"));
        // generating the url
        const data = generateEmailValidationUrl(request, user._id);
        // create Dynamic data for the email
        const dynamic_template_date = {
          subject: "Email Verification",
          name: user.name,
          redirect_url: data,
        };
        // sending mail
        mail.sendMail(
          user.email,
          dynamic_template_date,
          "d-7477f4e6aaa4487aaf575433da69bf61"
        );
        // sending response
        return response.status(200).json(getSuccessResponse("Email sent"));
      })
      .catch((err) => response.status(400).json(getErrorResponse(err.message)));
  } catch (err) {
    return response.status(400).json(getErrorResponse(err.message));
  }
};

// function to verify the email of the customer
exports.verifyUserEmail = async (request, response) => {
  try {
    const { token } = request.params;
    const { id, expires } = jwt.verify(token, process.env.TOKEN_SECRET);
    // Check whether expiry time is less than current time
    // if less than we will show that Link is expired
    const current_date = new Date();
    if (expires < current_date.getTime())
      return response.redirect(
        "http://localhost:4000/email-not-verified?err=Link Expired!&status=400&data=null"
      );
    // else will verify the users email.
    await User.findOne({ _id: id })
      .then((user) => {
        user.isEmailVerified = true;
        response.redirect(
          "http://localhost:4000/login?err=null&status=200&data=Email Verified!"
        );
        user.save();
      })
      .catch((err) => getErrorResponse(err.message));
  } catch (err) {
    response.status(400).json(getErrorResponse(err.message));
  }
};
