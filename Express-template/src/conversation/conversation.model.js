const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    members: {
        type: Array,
    },
},
{
    timestamps: true,
})

const Conversation = mongoose.model("Conversations", conversationSchema);

module.exports = Conversation;