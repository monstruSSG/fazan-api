const mongoose = require('mongoose')
const { words } = require('../constants')


const { Schema } = mongoose

const wordSchema = new Schema({
    word: String
})

//better search results with index
wordSchema.index({ word: 1 })

exports.wordModel = mongoose.model(words, wordSchema)