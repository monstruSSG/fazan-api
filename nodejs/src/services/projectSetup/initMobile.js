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


    db.run("CREATE TABLE IF NOT EXISTS words (id int AUTO_INCREMENT, name VARCHAR (255), weight int)")

    lineReader.on('close', () => {
        var stmt = db.prepare("INSERT INTO words(name) VALUES (?)");
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
        });



        db.close();
    })
});