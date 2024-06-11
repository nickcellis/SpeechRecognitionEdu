require('dotenv').config()
var mysql = require('mysql')
var database;

function connect() {
    if (!database) {
        database = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Hitman1234',
            database: 'lang-project'
        })

        database.connect(err => {
            if (!err) {
                console.log('[Mysql] Connected! ')
            } else {
                console.log('[Mysql] Failed to connect!', err)
            }
        })
    }

    return database;
}

module.exports = connect();