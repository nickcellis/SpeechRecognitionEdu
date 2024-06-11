const express = require('express')
const database = require('../../database/database.js')
const response = require('../api/response/response.js')
const api = express.Router();
const user = require('./user.js')
const words = require('./words.js')

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


api.use('/word', words);
api.use('/user', user);

api.get('/langs', (req, res) => {
    const languages = []
    res.send(ResponseResult(null, response.uuid, {
        language_support : languages
    }))
})

api.get('/language/:language', (req, res) => {
    
})




module.exports = api;