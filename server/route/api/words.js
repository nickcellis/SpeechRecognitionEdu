const express = require('express');
const database = require('../../database/database.js');
const db = require('../../database/database.js')
const response = require('../api/response/response.js')
const router = express.Router();

const ResponseResult = (userId, res, o) => {
    if (!userId) {
        return ({
            response_code: res, other : o
        })
    }
    return(
        {
            uuid : userId,
            response_code : res,
            other : o
        }
    )
}

router.get('/words', async (req, res) => {
    const query = req.query
    if (Object.keys(query).length === 0) return;
    const lang = query.lang
    const level = query.level;
    const valid = level.toLowerCase() === "beginner" 
        || level.toLowerCase() === "intermediate" 
        || level.toLowerCase() === "advanced";

    if (!valid) {
        console.log("invalid level input")
        return;
    }

    if (lang == null) {
        console.log("invalid lang")
        return;
    } 

    await database.query('SELECT * FROM entities WHERE level=? AND language=?', [level.toLowerCase(), lang.toLocaleLowerCase()], function(err, results, fields) {
        if (err) throw err
        res.json(results)
    })
})

router.get('/:word/:level/:language', (req, res) => {
    console.log(req.params);
})

router.post('/add', (req, res) => {
    const { word, level, language } = req.body;
    console.log(word, level, language)
    // Ensure all required fields are provided
    if (!word || !level || !language) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

     // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid level' });
    }


    // Validate language (assuming it's a valid language)
    const validLanguages = ['en', 'fr']; // Add more if needed
    if (!validLanguages.includes(language.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid language' });
    }

    // If all checks pass, proceed with your logic
    // Example: save the data to a database
    // Your logic here...
    console.log(`Word: ${word}, Level: ${level}, Language: ${language}`);

    database.query(`INSERT INTO entities (name, level, language) values ('${word}', '${level}', '${language}')`, function (err, result) {
        if (err) throw err;
    })

        // Respond with success message
    res.status(200).json({ message: 'Data received successfully' });
});


router.post('/remove', (req, res) => {
    const { word, level, language } = req.body;
    console.log(word, level, language)
    // Ensure all required fields are provided
    if (!word || !level || !language) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

     // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid level' });
    }


    // Validate language (assuming it's a valid language)
    const validLanguages = ['en', 'fr']; // Add more if needed
    if (!validLanguages.includes(language.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid language' });
    }

    // If all checks pass, proceed with your logic
    // Example: save the data to a database
    // Your logic here...
    console.log(`Word: ${word}, Level: ${level}, Language: ${language}`);

    database.query(`DELETE FROM entities WHERE name = '${word}' AND level = '${level}' AND language = '${language}'`, function (err, result) {
        if (err) throw err;
        console.log("Number of rows deleted: " + result.affectedRows);
    });

        // Respond with success message
    res.status(200).json({ message: 'Data received successfully' });
});

module.exports = router;