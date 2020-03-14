var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./fazanWords.db')
const fs = require('fs')
const path = require('path')
const readLine = require('readline')

db.serialize(function () {

    const lineReader = readLine.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'db.txt'))
    })

    let wordsArray = []

    lineReader.on('line', line => {
        wordsArray.push(line.trim())
    })

    db.run("CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word VARCHAR (255), weight INTEGER DEFAULT 0)")

    lineReader.on('close', () => {
        var stmt = db.prepare("INSERT INTO words(word) VALUES (?)");
        wordsArray.forEach(word => {
            stmt.run(word, err => {
               if (!err) return console.log(`${word} inserted`)
                console.log(err)
            });
        })
        stmt.finalize(err => {
            console.log(err)
            db.each("Select COUNT(*) from words", function (err, row) {
                console.log(row)
            });

            //update weight
            console.log("Now update common words")
            const lineReaderUsed = readLine.createInterface({
                input: fs.createReadStream(path.join(__dirname, 'mostUsed.txt'))
            })

            let mostUsedArray = []

            lineReaderUsed.on('line', line => {
                mostUsedArray.push(line.trim())
            })

            lineReaderUsed.on('close', () => {

                stmt = db.prepare("UPDATE words set weight = 1 where word = ?");
                mostUsedArray.forEach(word => {
                    stmt.run(word, err => {
                        if (!err) return console.log(`${word} updated`)
                        console.log(err)
                    });
                })

                stmt.finalize(err => {
                    if (!err) console.log("Everything was ok")
                    console.log("Finish")
                });

                db.close();
            })
        })

    })
});