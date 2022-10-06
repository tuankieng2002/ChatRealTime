const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversationId: {//số id của cuộc trò chuyện của 2 người
        type: String,
    },
    sender: {//người gửi
        type: String,
    },
    text: {
        type: String,
    },
},
{
    timestamps: true,
})

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;