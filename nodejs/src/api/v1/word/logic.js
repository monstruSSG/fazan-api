const httpStatus = require('http-status');
const database = require('./database');


let logic = {
    find: limit => database.find({}, limit),
    getRandomValidWord: () => {
        //get random sample from database
        //if that word is a final word
        //get another one
        //else return word
        let recursiveCheckForWords = () => database.aggregate([{ $sample: { size: 1 } }])
            .then(wordSample => logic.checkWordSubstring(wordSample[0].word)
                .then(() => Promise.resolve(wordSample[0].word))
                .catch(() => recursiveCheckForWords())
            )
        return recursiveCheckForWords()
    },
    checkWordSubstring: word => database.findOne({ word: { $regex: `^${word.slice(-2)}` } }) //find word starting with ending two letters of given word
        .then(word => {
            //word not found, game over
            if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
    check: word => database.findOne({ word })
        .then(word => {
            //word not found
            if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
    createMany: database.createMany,
    create: database.create,
}

module.exports = logic