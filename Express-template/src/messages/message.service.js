const Message = require("./message.model");

//create a new message
const createMessage = async (messageBody) => {
    return await Message.create(messageBody);
}

//get conversation id
const getConversationId = async (conversationId) => {
    return await Message.find(conversationId);
}

module.exports = {
    createMessage,
    getConversationId
}