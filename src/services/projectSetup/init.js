const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const wordLogic = require('../../api/v1/word/logic');
const dbConnection = require('../../database/connection')

dbConnection().then(() => {
    console.log('Connected to db');
    const lineReader = readLine.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'db.txt'))
    });

    let wordsArray = []

    lineReader.on('line', line => {
        wordsArray.push(line);
    });

    lineReader.on('close', () => {
        recursiveInsert(0, () => {
            console.log('Database was populated');
            process.exit(0);
        })
    })

    console.log('Populating words database...')

    const recursiveInsert = (index, callback) => {
        if (!wordsArray[index]) return callback()
        wordLogic.create(wordsArray[index]).then(() => {
            //clear stack before call
            console.log(`Inserted word nr ${index}`);
            setTimeout(() => recursiveInsert(++index, callback), 0);
        }).catch(err => {
            console.log(`Error inserting  ${wordsArray[index]}`, err);
            //clear stack before call
            setTimeout(() => recursiveInsert(++index, callback), 0);
        })
    }
}).catch(err => {
    console.log('Could not connect to database!', err)
});
