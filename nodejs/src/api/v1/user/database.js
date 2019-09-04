const { userModel } = require('../../../database/models/index');


module.exports = {
    find: (query = {}, limit = {}) => userModel.find(query)
        .skip(limit.from)
        .limit(limit.limit)
        .lean().exec(),
    update: (userId, query) => wordModel.update(userId, query)
        .lean().exec()
}