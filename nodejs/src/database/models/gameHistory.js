const mongoose = require('mongoose');
const moment = require('moment');
const { gamesHistory, users } = require('../constants');
const { won, lost } = require('../../utils/constants/app');


const { Schema } = mongoose;

const gamesHistory = new Schema({
    user: { type: Schema.Types.ObjectId, ref: users },
    outcome: {
        type: String,
        enum: [won, lost],
        default: won
    },
    dateTime: {
        type: Date,
        default: moment().toISOString()
    }
});

exports.gameHistoryModel = mongoose.model(gamesHistory, gamesHistory);