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

    let excludePrefix = ['nt', 'ns', 'rb', 'mn', 'rt', 'rn', 'lf', 'ng', 'nd', 'rn', 'rd', 'uu', 'lt', 'ft', 'lc', 'rs', 'mb',
        'ee', 'rv', 'ct', 'mf', 'nc']

    lineReader.on('line', line => {
        if (
            wordsArray.findIndex(query => query.insertOne.document.word === line.trim()) < 0 &&  //does not already exists in list and
            excludePrefix.indexOf(line.substring(0, 2) < 0) //does not start with excludePrefix
        ) {
            console.log(line)
            wordsArray.push({ insertOne: { document: { word: line.trim() } } })
        }
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
