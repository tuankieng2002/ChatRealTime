const Conversation = require("./conversation.model");

//Create a new Conversation
const createConversation = async (conversationBody) => {
    return await Conversation.create(conversationBody);
}

//get conversation of a user
const getConversationByUserId = async (userId) => {
    return await Conversation.find(userId);
}

module.exports = {
    createConversation,
    getConversationByUserId
}