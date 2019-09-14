const { gameHistory } = require('../../../database/models/index');


module.exports = {
    find: (query = {}, limit = {}) => gameHistory.find(query)
        .skip(limit.from)
        .limit(limit.limit)
        .lean().exec(),
    findOne: query => gameHistory.findOne(query)
        .lean().exec(),
    create: historyObj => gameHistory.create(historyObj),
    createMany: historyObj => gameHistory.insertMany(historyObj),
    deleteById: id => gameHistory.findByIdAndDelete(id)
}