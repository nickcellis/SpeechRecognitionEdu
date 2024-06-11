require('dotenv').config()

const express = require("express");
const database = require('./database/database.js')
const app = express();
const api = require('./route/api/api');
const words = require('./util/Words.js')
var cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json()); // Add this line to parse JSON requests
app.use("/api", api);

// Set PORT of the back end server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});

// Check if data exist. If not generate words
database.query("SELECT COUNT(*) FROM entities", async function (err, result, fields) {
    if (err) throw err;
    const data = result[0];
    if (data['COUNT(*)'] !== 0) return;
    console.log("")
    console.log("Generating language entities....");

    initEnglishWords(database)
    initFrenchWords(database)


    console.log("Lanaguage entities completed.")
})

/**
 * Const function to generate english words into the database.
 * @param {*} database 
 */
const initEnglishWords = (database) => {
    console.log('Generating: English words...')

    const beginner = [];
    const intermediate = [];
    const advanced = [];
    words.getWordList(150, 'en').forEach(word => {
        const syllables = words.getSyllables(word);
        if (syllables < 3) {
            beginner.push(word)
        } else if (syllables > 2 && syllables < 5) {
            intermediate.push(word)
        } else {
            advanced.push(word)
        }
    })

    // Generating and categorizing words 
    // based on syllables of word
    beginner.forEach(word => {
        database.query(`INSERT INTO entities (name, level, language) values ('${word}', 'beginner', 'en')`, function (err, result) {
            if (err) throw err;
        })
    })

    intermediate.forEach(word => {
        database.query(`INSERT INTO entities (name, level, language) values ('${word}', 'intermediate', 'en')`, function (err, result) {
            if (err) throw err;
        })
    })

    advanced.forEach(word => {
        database.query(`INSERT INTO entities (name, level, language) values ('${word}', 'advanced', 'en')`, function (err, result) {
            if (err) throw err;
        })
    })
}


/**
 * Constant Function to generate french words
 * @param {} database 
 */
const initFrenchWords = (database) => {
    console.log('Generating: French words...')
    const beginner = [];
    const intermediate = [];
    const advanced = [];
    words.getWordList(150, 'fr').forEach(word => {
        const syllables = words.getSyllables(word);
        if (syllables < 3) {
            beginner.push(word)
        } else if (syllables > 2 && syllables < 5) {
            intermediate.push(word)
        } else {
            advanced.push(word)
        }
    })
    // Generating and categorizing words 
    // based on syllables of word
    beginner.forEach(word => {
        database.query(`INSERT INTO entities (name, level, language) values ('${word}', 'beginner', 'fr')`, function (err, result) {
            if (err) throw err;
        })
    })
    intermediate.forEach(word => {
        database.query(`INSERT INTO entities (name, level, language) values ('${word}', 'intermediate', 'fr')`, function (err, result) {
            if (err) throw err;
        })
    })
    advanced.forEach(word => {
        database.query(`INSERT INTO entities (name, level, language) values ('${word}', 'advanced', 'fr')`, function (err, result) {
            if (err) throw err;
        })
    })
}