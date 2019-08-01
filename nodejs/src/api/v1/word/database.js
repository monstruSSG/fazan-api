const { wordModel } = require('../../../database/models/index');


module.exports = {
    find: (query = {}, limit = {}) => wordModel.find(query)
        .skip(limit.from)
        .limit(limit.limit)
        .lean().exec(),
    aggregate: query => wordModel.aggregate(query).exec(),
    findOne: query => wordModel.findOne(query).lean().exec(),
    create: word => wordModel.create({ word }),
    createMany: words => wordModel.insertMany(words)
}