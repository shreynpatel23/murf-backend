const router = require("express").Router();
const channelController = require("../controllers/channel");

//routes for creating a channel
router.post("/create-channel", channelController.createCustomChannel);

//routes for deleting a channel
router.delete("/delete-channel", channelController.deleteChannel);

module.exports = router;
