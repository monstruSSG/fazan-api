const mongoose = require('mongoose');
const { users } = require('../constants');
const { available, busy} = require('../../utils/constants/app');


const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    shortName: String,
    pictureUrl: String,
    facebookId: String,
    googleId: String,
    password: {
        type: String,
        select: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: [available, busy],
        default: available
    },
    socketId: {
        type: String
    },
    wins: {
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    }
});

exports.userModel = mongoose.model(users, userSchema);