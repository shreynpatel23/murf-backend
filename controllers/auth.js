let User = require("../modals/user.modal");
const jwt = require("jsonwebtoken");

exports.register = async (request, response) => {
  // check whether email is present in our database or not.
  const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);
  const user = await User.findOne({ email: request.body.email });
  if (user)
    return response.status(200).send({
      error: "email already exist",
      data: { ...user._doc, token: token },
    });
  try {
    const newUser = new User({
      name: request.body.name,
      email: request.body.email,
      imageUrl: request.body.imageUrl,
    });
    newUser
      .save()
      .then((res) => {
        response.header("authToken", token);
        response.json({
          error: "",
          data: {
            _id: res._id,
            token: token,
            name: res.name,
            email: res.email,
            imageUrl: res.imageUrl,
          },
        });
      })
      .catch((err) => {
        response.status(400).json(err.message);
      });
  } catch (err) {
    response.status(400).json("please provide valid data point");
  }
};
