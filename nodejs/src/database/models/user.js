const mongoose = require('mongoose');
const { users } = require('../constants');
const { available, busy} = require('../../utils/constants/app');


const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: [available, busy],
        default: inactive
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