const httpStatus = require("http-status");
const postService = require('./post.service');
const Post = require('./post.model');
const User = require('../user/user.model');

//Create post
const createPost = async (req, res, next) => {
    console.log(req.body);
    const post = await postService.createPost(req.body);

    try {
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "success",
            data: post
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//Update a post
const updatePost = async (req, res, next) => {
    const post = await postService.updatePost(req.params.id, req.body);

    if (post.userId === req.body.userId) {
        try {
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "success",
                data: post
            });
        } catch (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
    }
}

//Delete a post
const deletePost = async (req, res, next) => {
    console.log(req.params.id);
    const post = await postService.deletePost(req.params.id);

    if (post.userId === req.body.userId) {
        await post.deleteOne();
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "the post has been deleted",
            data: null
        });
    } else {
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: httpStatus.UNAUTHORIZED,
            message: "you can delete only your post",
            data: null
        });
    }
}

//Like/dislike a post
const likePost = async (req, res, next) => {
    try {
        const post = await postService.likePost(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "the post has been liked",
                data: null
            });
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "the post has been disliked",
                data: null
            });
        }
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//Get a post
const getPost = async (req, res, next) => {
    try {
        const post = await postService.getPost(req.params.id);
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: post
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//Get timeline posts
const getTimelinePosts = async (req, res, next) => {//get timeline posts d??ng ????? l???y c??c b??i post c???a nh???ng ng?????i follow m??nh v?? b??i post c???a m??nh
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });

        const friendPosts = await Promise.all(
            currentUser.followers.map((friendId) => {//map d??ng ????? duy???t qua c??c ph???n t??? trong m???ng c???a currentUser.followers v?? tr??? v??? m???t m???ng m???i ch???a c??c ph???n t??? sau khi ???? th???c hi???n h??m callback trong map
                console.log(friendId);//friendId l?? id c???a m???t ng?????i follow m??nh
                return Post.find({ userId: friendId });//tr??? v??? m???t m???ng c??c b??i post c???a m???t ng?????i follow m??nh. find tr??? v??? m???t m???ng c??c b??i post c???a m???t ng?????i follow m??nh. userId l?? id c???a m???t ng?????i follow m??nh trong b???ng post trong db c??n friendId l?? id c???a m???t ng?????i follow m??nh trong b???ng user trong db.
            })
        );

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: userPosts.concat(...friendPosts)
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts
};