const Post = require('../models/postsModel.js');
const User = require('../models/usersModel');
const responseHandler = require('../utils/responseHandler');

const postsController = {
    getPosts: async (req, res) => {
        try {
            let query = {};
            let size = 100; //上限100筆

            if (req.query.userName) {
                query['userInfo.userName'] = req.query.userName;
            }

            if (req.query.startTime && req.query.endTime) {
                query.createdAt = {
                    $gte: req.query.startTime,
                    $lte: req.query.endTime
                }
            }

            if (req.query.keyword) {
                query.content = {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }

            if (req.query.size) {
                size = parseInt(req.query.size) > 100 ? 100 : parseInt(req.query.size);
            }

            // const posts = await Post.find(query)
            //     .populate('userId')
            //     .sort(req.query.sortDirection === "desc" ? { createdAt: -1 } : { createdAt: 1 })
            //     .limit(size);

            const posts = await Post.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: '$userInfo'
                },
                {
                    $match: query
                },
                {
                    $project:{
                        _id:1,
                        content:1,
                        image:1,
                        likeUsers:1,
                        comments:1,
                        createdAt:1,
                        'userInfo.userName':1,
                    }
                },
                {
                    $sort: req.query.sortDirection === "desc" ? { createdAt: -1 } : { createdAt: 1 }
                },
                {
                    $limit: size
                }
            ]);
            responseHandler.sendSuccess(res, 200, "取得貼文成功", posts);
        } catch (error) {
            console.log(`error:${error}`);
            responseHandler.sendError(res, 400, error);
        }
    },
    createPost: async (req, res) => {
        try {
            const newPost = new Post({
                content: req.body.content,
                image: req.body.image,
                userId: req.body.userId
            });
            const createResult = await Post.create(newPost);
            responseHandler.sendSuccess(res, 200, "新增貼文成功", createResult);
        } catch (error) {
            responseHandler.sendError(res, 400, error);
        }
    },
    updatePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                responseHandler.sendError(res, 404, '查無此貼文');
            }
            post.content = req.body.content;
            post.image = req.body.image;
            await post.save();
            res.json(post);
        } catch (error) {
            responseHandler.sendError(res, 400, error);
        }
    },
    deletePosts: async (req, res) => {
        try {
            const deleteResult = await Post.deleteMany({});
            res.json({ message: 'all posts deleted' });
        } catch (error) {
            responseHandler.sendError(res, 400, error);
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            await post.remove();
            res.json({ message: 'Post deleted' });
        } catch (error) {
            responseHandler.sendError(res, 400, error);
        }
    }
}

module.exports = postsController;