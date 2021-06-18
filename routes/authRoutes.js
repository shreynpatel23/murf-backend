const router = require("express").Router();
const AuthController = require("../controllers/authController");

router.post("/login", AuthController.getUser);

router.post("/sign-up", AuthController.createUser);

router.post("/sign-in-using-google", AuthController.signInUsingGoogle);

router.post("/login-using-google", AuthController.loginUsingGoogle);

router.get("/verify/:token", AuthController.verifyUserEmail);

module.exports = router;
