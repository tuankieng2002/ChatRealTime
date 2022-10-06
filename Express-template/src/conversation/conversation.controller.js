const httpStatus = require("http-status");
const conversationService = require("./conversation.service");

//Create a new Conversation
const createConversation = async (req, res) => {
    const conversation = await conversationService.createConversation({
        members:[
            req.body.senderId,
            req.body.receiverId,
        ]
    })

    try{
        res.status(httpStatus.CREATED).json( conversation);
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

//get conversation of a user
const getConversationByUserId = async (req, res) => {

    try{
        const conversation = await conversationService.getConversationByUserId({
            members:{
                $in: [req.params.id]
            }
        })
        res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "success",
            data: conversation
        });
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

module.exports = {
    createConversation,
    getConversationByUserId
};