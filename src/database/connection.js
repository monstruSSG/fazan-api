const mongoose = require('mongoose');

const CONFIG = require('../../config/defaults');

mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.MONGO.URI, {
    useNewUrlParser: true
});

module.exports = { mongoose };