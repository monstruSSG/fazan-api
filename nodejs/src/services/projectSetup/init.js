const fs = require('fs')
const path = require('path')
const readLine = require('readline')
const { wordModel } = require('../../database/models/index')
const dbConnection = require('../../database/connection')

dbConnection().then(() => {
    console.log('Connected to db')
    const lineReader = readLine.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'db.txt'))
    })

    let wordsArray = []

    lineReader.on('line', line => {
        wordsArray.push({ insertOne: { word: line.trim() } })
    })

    lineReader.on('close', () => {
        console.log('Populating words database...')

        wordModel.bulkWrite(wordsArray).then(() => {
            console.log(`All ${wordsArray.length} were inserted`)
            process.exit(0)
        }).catch(err => {
            console.log(`Error: `, err)
            process.exit(1)
        })
    })
}).catch(err => {
    console.log('Could not connect to database!', err)
})
