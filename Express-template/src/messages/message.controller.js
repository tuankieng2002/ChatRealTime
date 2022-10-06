const httpStatus = require("http-status");
const messageService = require("./message.service");

//create a new message
const createMessage = async (req, res) => {
    const message = await messageService.createMessage({
        conversationId: req.body.conversationId,
        sender: req.body.sender,
        text: req.body.text,
    })

    try{
        res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "success",
            data: message
        });
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

//get conversation id
const getConversationId = async (req, res) => {
    console.log(req.params.id);
    try{
    const message = await messageService.getConversationId(
        {conversationId: req.params.id}
    )
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: message
        });
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}


module.exports = {
    createMessage,
    getConversationId
};