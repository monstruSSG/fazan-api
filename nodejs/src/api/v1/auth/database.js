const { userModel } = require('../../../database/models/index');


module.exports = {
    findUserById: userId => userModel.findById(userId),
    findOne: query => userModel.findOne(query),
    create: user => userModel.create(user)
}