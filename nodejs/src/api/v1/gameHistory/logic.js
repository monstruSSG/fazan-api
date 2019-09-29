const httpStatus = require('http-status');
const database = require('./database');
const { maximumHistoryLenght } = require('../../../utils/constants/app');


module.exports = {
    find: query => database.find(query, { limit: maximumHistoryLenght }),
    create: historyObj => database.find({ user: historyObj.user }).then(history => {

        //check maximum number of games history
        if (history && history.length > maximumHistoryLenght) {
            let lastArrayElement = history.pop();
            return database.deleteById(lastArrayElement._id).then(() =>
                database.create(historyObj)
            )
        } else
            return database.create(historyObj);
    })
        .then(() => Promise.resolve({ status: httpStatus.OK }))
        .catch(error => Promise.reject({ status: httpStatus.BAD_REQUEST, error }))
}