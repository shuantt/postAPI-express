const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        validator: function(value){
            return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
        }
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    gender: {
        type: Number,
        required: true
    },
    userPhoto: {
        type: String,
        default: ''
    },        
    followings: [{
       userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        followDate: {
            type: Date,
            default: Date.now
        }
    }],
    followers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        followDate: {
            type: Date,
            default: Date.now
        }
    }],
    likePosts: [{
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        likeDate: {
            type: Date,
            default: Date.now
        }
    }]
}, 
{timestamps: true}
);

module.exports = mongoose.model('User', userSchema);