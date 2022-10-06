const express = require('express');
const messageController = require('../messages/message.controller');

const router = express.Router();

//create a new message
router.post('/createNew', messageController.createMessage);

//get conversation id
router.get('/getConversationId/:id', messageController.getConversationId);

module.exports = router;