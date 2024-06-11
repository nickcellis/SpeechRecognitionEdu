const fs = require('fs')

function readWordsFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8')

    const words = data.split('\n')
    const filteredWords = words.filter(word => word.trim() !== '')
    return filteredWords

  } catch (err) {
    console.error('Error reading file:', err)
    return[]
  }
}

const frenchWords = readWordsFromFile('./lang/fr.txt')
const englishWords = readWordsFromFile('./lang/en.txt')


// Export the word list as it is often useful
module.exports = {
    frenchWords, englishWords
}