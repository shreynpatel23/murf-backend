const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema({
  channel_name: {
    type: String,
    required: true,
  },
  forumId: {
    type: Schema.Types.ObjectId,
    ref: "Forum",
    required: true,
  },
  postIds: {
    type: Array,
  },
});

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
