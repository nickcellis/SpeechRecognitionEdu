const fetch = require("node-fetch");
const WORDS_API = "https://random-word-api.herokuapp.com/word?"

function generateWords(length, amount) {

    return fetch(WORDS_API + "length=" + length + "&number=" + amount)
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((error) => {
        console.log(error);
    })

}

module.exports = {
    generateWords
}