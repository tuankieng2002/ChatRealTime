const Post = require('../post/post.model');

//Create post
const createPost = async (postBody) => {
    return await Post.create(postBody);
};

//Update a post
const updatePost = async (postId, postBody) => {
    return await Post.findByIdAndUpdate(postId, postBody, {new: true});
};

//Delete a post
const deletePost = async (postId) => {
    return await Post.findById(postId);
};

//Like a post
const likePost = async (postId) => {
    return await Post.findById(postId);
}

//Get a post
const getPost = async (postId) => {
    return await Post.findById(postId);
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost
};