const express = require('express');
const conversationController = require('../conversation/conversation.controller');

const router = express.Router();

router.post('/createNew', conversationController.createConversation);

//get conversation of a user
router.get('/:id', conversationController.getConversationByUserId);

module.exports = router;