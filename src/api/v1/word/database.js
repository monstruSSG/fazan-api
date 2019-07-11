const { wordModel } = require('../../../database/models/index');
const config = require('../../../../config/defaults');


module.exports = {
    find: (query = {}, limits = {}) => wordModel.find(query)
        .skip(limits.from || config.queryFrom)
        .limit(limits.to || config.queryLimit)
        .lean().exec(),
    findOne: query => wordModel.findOne(query)
        .lean().exec(),
    create: word => wordModel.create({ word })
}