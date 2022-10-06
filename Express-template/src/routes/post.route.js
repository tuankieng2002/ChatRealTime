const postController = require('../post/post.controller');
const express = require('express');
const router = express.Router();

//Create post
router.post('/new-post', postController.createPost);

//Update a post
router.put('/updatePost/:id', postController.updatePost);

//Delete a post
router.delete('/deletePost/:id', postController.deletePost);

//Like a post
router.put('/:id/likePost', postController.likePost);

//Get a post
router.get('/:id', postController.getPost);

//Get timeline posts
router.get('/timeline/all', postController.getTimelinePosts);

module.exports = router;