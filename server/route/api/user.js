const express = require('express')
const db = require('../../database/database.js')
const response = require('../api/response/response.js')
const user = express.Router();

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

user.post('/initial', (req, res) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1]; // Extracting the token part
    const userId = token; // Assuming the user_id is directly in the token

    getUserByHeaderId(req, res, (data) => {
        const hasProfile = data && data.user_id;
        if (!hasProfile) {
            // No profile found!
            console.log('Registering new user to the database.')
            db.query(`INSERT INTO users (user_id) VALUES ('${userId}')`), 
            function(err, res) {
                if (err) {
                   res.send(ResponseResult(userId, response.FAILED, {
                       error: 'Error executing query (user creation)'
                   }))
                   console.log('Error executing query (user creation): ', err)
                   return;
                }
                // You can now use this userId in your backend logic
                res.send(ResponseResult(userId, response.SUCCESS, []))
            }
        }
    })
})


// Get user-info
user.get('/:id', (req, res) => {
    getUserByParam(req, res, (data) => {
        const hasProfile = data && data.user_id;
        if (!hasProfile) {
            res.send(ResponseResult(undefined, response.FAILED, {
                message: 'Profile not found'
            }))
            return
        }
        res.send(ResponseResult(data.user_id, response.SUCCESS, data))
    })
})

user.put('/:id/success', (req, res) => {
    getUserByParam(req, res, (data) => {
        const hasProfile = data && data.user_id;
        if (!hasProfile) {
            res.send(ResponseResult(undefined, response.FAILED, {
                message: 'Profile not found'
            }))
            return
        }

        const body = req.body;
        const mode = body.level.toLowerCase()
        db.query(`INSERT INTO user_words (user_id, word_id) VALUES ('${body.user_id}', '${body.word_id}')`, function (err, results) {
            if (err) {
                console.log('INSERT ERROR: ', err)
            }
        })

        db.query(`UPDATE users SET attempts = attempts + 1, success = success + 1, ${mode} = ${mode} + 1  WHERE user_id = '${body.user_id}'`, function (err, results) {
            if (err) {
                console.log('UPDATE ERR: ' + err)
            }
        })
    })
})

user.put('/:id/unsucess', (req, res) => {
    getUserByParam(req, res, (data) => {
        const hasProfile = data && data.user_id;
        if (!hasProfile) {
            res.send(ResponseResult(undefined, response.FAILED, {
                message: 'Profile not found'
            }))
            return
        }

        const body = req.body;
        db.query(`INSERT INTO user_words (user_id, word_id) VALUES ('${body.user_id}', '${body.word_id}')`, function (err, results) {
            if (err) {
                console.log('INSERT ERROR: ', err)
            }
        })

        db.query(`UPDATE users SET attempts = attempts + 1WHERE user_id = '${body.user_id}'`, function (err, results) {
            if (err) {
                console.log('UPDATE ERR: ' + err)
            }
        })
    })
})

user.get('/completed/:id/:word_id', (req, res) => {
    getUserByParam(req, res, (data) => {
        const hasProfile = data && data.user_id;
        if (!hasProfile) {
            res.send(ResponseResult(undefined, response.FAILED, {
                message: 'Profile not found'
            }))
            return
        }
        db.query(`SELECT word_id FROM user_words WHERE word_id = '${req.params.word_id}' AND user_id = '${req.params.id}'`,
        function(err, results) {
            if (err) {
                console.log('COMPLETE GET: ', err)
                return
            }
            res.send(ResponseResult(data.user_id, response.SUCCESS, {
                Completed: 'True'
            }))
        })
    })
})

user.get('/completed-words/:id', (req, res) => {
    getUserByParam(req, res, (data) => {
        if (!hasProfile(data, res)) return
        db.query(`SELECT word_id FROM user_words WHERE user_id = '${req.params.id}'`,
        function(err, results) {
            if (err) {
                console.log('COMPLETE ALL GET: ', err)
                return
            }

            res.send(ResponseResult(data.user_id, response.SUCCESS, {
                Words: results
            }))
            
        })
    })
})

user.get('/:id/satistics', (req, res) => {
    getUserByParam(req, res, (data) => {
        if (!hasProfile(data, res)) return
        res.json(ResponseResult(data.user_id, response.SUCCESS, {
            'last_session': data.last_session,
            'attempts': data.attempts,
            'success': data.success,
            'beginner': data.beginner,
            'intermediate': data.intermediate,
            'advanced': data.advanced
        }))
    })
})

function hasProfile(data, res) {
    const hasProfile = data && data.user_id;
    if (!hasProfile) {
        res.send(ResponseResult(undefined, response.FAILED, {
            message: 'Profile not found'
        }))
        return false
    }
    return true
}

function getUserByHeaderId(req, res, callback) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1]; // Extracting the token part
    const userId = token; // Assuming the user_id is directly in the token

    return getUser(userId, callback)
}

function getUserByParam(req, res, callback) {
    return getUser(req.params.id, callback)
}

function getUser(id, callback) {
    const userId = id; // Assuming the user_id is directly in the token
    db.query('SELECT * FROM users WHERE user_id=?', [`${userId}`],  // Instead of * it waas user_id
     function(err, res) {
         if (err) {
             console.log('Error executing query (user initial): ', err)
             return
         }
         return callback(res[0]);
    })
}


module.exports = user;
