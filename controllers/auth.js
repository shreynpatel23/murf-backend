let User = require("../modals/user.modal");
const jwt = require("jsonwebtoken");

exports.register = async (request, response) => {
  // check whether email is present in our database or not.
  const emailExist = await User.findOne({ email: request.body.email });
  if (emailExist) return response.status(400).send("email already exist");
  // const user = await User.findOne({ email: request.body.email });
  // const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);
  // if (user) {
  //   try {
  //     const { _doc } = user;
  //     return (
  //       response.header("authToken", token),
  //       response.json({
  //         id: _doc._id,
  //         name: _doc.name,
  //         email: _doc.email,
  //         imageUrl: _doc.imageUrl,
  //         forumId: _doc.forumId,
  //         token: token,
  //       })
  //     );
  //     // return response
  //     // .status(400)
  //     // .send({ error: "email already exist", data: user });
  //   } catch (err) {
  //     response.status(400).json("please provide valid data point");
  //   }
  // }

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
          id: res._id,
          token: token,
          name: res.name,
          email: res.email,
          imageUrl: res.imageUrl,
        });
      })
      .catch((err) => {
        response.status(400).json(err.message);
      });
  } catch (err) {
    response.status(400).json("please provide valid data point");
  }
};
