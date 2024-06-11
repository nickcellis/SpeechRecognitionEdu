const { englishWords, frenchWords } = require("./WordList")

module.exports = {
    getWordList, getSyllables
}

// function getWords(minLengths, length, amount) {
//     const result = []
//     for (var i = 0; i < wordList.length; i++) {
//         if (result.length > amount) break;
//         const word = wordList[i];
//         if (word.length <= length && word.length >= minLengths) {
//             result.push(word);
//         }
//     }
//     const unique = [...new Set(result)];
//     return unique;
// }

function getWordList(amount, lang) {
    const result = []
    const list = getList(lang)
    for (var i = 0; i < list.length; i++) {
        if (result.length > amount) break;
        const word = list[i];
        result.push(word);
    }
    const unique = [...new Set(result)];
    return unique;
}


function getSyllables(word) {
    const syllables = word.match(/[aeiou]{1,2}/gi).length;
    return syllables;
}

function getList(lang) {
    switch(lang.toLowerCase()) {
        case 'en': {
            return englishWords;
        }
        case 'fr': {
            return frenchWords;
        }
        default: englishWords;
    }
}


