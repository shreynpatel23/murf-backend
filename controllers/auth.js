let User = require("../modals/user.modal");
const jwt = require("jsonwebtoken");

exports.register = async (request, response) => {
  // check whether email is present in our database or not.
  const emailExist = await User.findOne({ email: request.body.email });
  if (emailExist) return response.status(400).send("email already exist");

  try {
    const newUser = new User({
      name: request.body.name,
      email: request.body.email,
      imageUrl: request.body.imageUrl,
      userName: request.body.userName,
    });
    const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);

    newUser
      .save()
      .then((res) => {
        response.header("authToken", token);
        response.json({
          id: res._id,
          token: token,
          name: res.name,
          email: res.email,
          imageUrl: res.imageUrl,
          userName: res.userName,
        });
      })
      .catch((err) => {
        response.status(400).json(err.message);
      });
  } catch (err) {
    response.status(400).json("please provide valid data point");
  }
};
