const httpStatus = require('http-status');
const database = require('./database');


var logic = {
    find: limit => database.find({}, limit),
    checkWordSubstring: word => {
        return database.findOne({ word: { $regex: new RegExp(`^${word.slice(-2)}`) } }) //find word starting with ending two letters of given word
            .then(word => {
                //word not found, game over
                if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
                return Promise.resolve({ status: httpStatus.OK })
            })
    },
    check: word => database.findOne({ word: word.toLowerCase() })
        .then(found => {
            //word not found
            if (!found) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
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
    createMany: database.createMany,
    create: database.create,
}

module.exports = logic