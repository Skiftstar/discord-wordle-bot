const fs = require("fs")
const path = require("path")
const crypto = require('crypto');
const { getConfigValue } = require("./config.js")
const { getWordsThatProducePattern } = require("./wordle-calc.js")

const POSSIBLE_WORDS_TXT = path.join(__dirname, `./../${getConfigValue("WORDLIST_FILE")}`)
const SHA_FILE = path.join(__dirname, `./../${getConfigValue("SHA_FILE")}`)

let sha, initialShaGuess, allWords, possibleWords

const loadWordsAndSHA = () => {
  const words = fs.readFileSync(POSSIBLE_WORDS_TXT)
  possibleWords = words.toString().split("\n").map(word => word.trim())

  // Will be used if we need to reference all words again
  // for mass elimination mode at the end
  allWords = words.toString().split("\n").map(word => word.trim())

  const sha_file_content = fs.readFileSync(SHA_FILE)
  sha = sha_file_content.toString().split("\n")[0]
  initialShaGuess = sha_file_content.toString().split("\n")[1]
}

const storeNewFirstGuess = (newFirstGuess) => {
  console.log("Storing new Hash and first guess...")
  fs.writeFileSync(SHA_FILE, `${sha}\n${newFirstGuess.word}`)
  console.log("Stored first Hash!")
}

const getFileHash = (filePath, algorithm = 'sha256') => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm)
    const stream = fs.createReadStream(filePath)

    stream.on('error', reject)
    stream.on('data', chunk => hash.update(chunk))
    stream.on('end', () => {
      resolve(hash.digest('hex'))
    })
  })
}

const confirmSHAValidity = async () => {
  console.log("Checking SHA validity...")
  const calculatedSha = await getFileHash(POSSIBLE_WORDS_TXT)
  if (calculatedSha !== sha) {
    sha = calculatedSha
    console.log("Hash not valid, first guess might take a while...")
    return false
  } else {
    console.log("Hash valid, using stored first guess!")
    return true
  }
}

// remove words that don't fit the pattern when compared against compareWord
const removeInvalidWords = (feedbackPattern, compareWord) => {
  possibleWords = getWordsThatProducePattern(possibleWords, feedbackPattern, compareWord)
}

const removeWordPermanently = (word) => {
  possibleWords = possibleWords.filter(w => w !== word)
  allWords = allWords.filter(w => w !== word)
  fs.writeFileSync(POSSIBLE_WORDS_TXT, allWords.join("\n"))
}

const getFirstGuessFromSHA = () => {
  return initialShaGuess;
}

const getLeftOverWords = () => {
  return possibleWords
}

const getAllWords = () => {
  return allWords
}

module.exports = { loadWordsAndSHA, removeWordPermanently, getLeftOverWords, getAllWords, removeInvalidWords, getFirstGuessFromSHA, confirmSHAValidity, storeNewFirstGuess }
