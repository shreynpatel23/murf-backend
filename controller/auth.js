const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let User = require("../modals/user.modal");

router.route("/register").post(async (request, response) => {
  // check whether email is present in our database or not.
  const emailExist = await User.findOne({ email: request.body.email });
  if (emailExist) return response.status(400).send("email already exist");

  // hash the users password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(request.body.password, salt);

  const newUser = new User({
    name: request.body.name,
    email: request.body.email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: request.body._id }, process.env.TOKEN_SECRET);

  newUser
    .save()
    .then((res) => {
      response.header("auth-token", token);
      response.json({
        id: res._id,
        token: token,
        name: res.name,
        email: res.email,
      });
    })
    .catch((err) => response.status(400).response.json(err));
});

module.exports = router;
