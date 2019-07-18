const mongoose = require('mongoose');
const { users } = require('../constants');


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
    }
});

exports.userModel = mongoose.model(users, userSchema);