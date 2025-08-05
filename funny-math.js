const { getPattern } = require("./wordle-calc.js")

const getNextGuess = (possibleWords) => {
  let bestGuess = { entropy: -1, word: "" }
  console.log("Possible Words:", possibleWords.length)
  for (const word of possibleWords) {
    const entropy = getWordEntropy(possibleWords, word)
    if (entropy > bestGuess.entropy) {
      bestGuess = {entropy, word}
    }
  }
  return bestGuess
}

const getWordEntropy = (possibleWords, wordToCheck) => {
  const patterns = {}
  for (const word of possibleWords) {
    const pattern = getPattern(wordToCheck, word)
    patterns[pattern] = (patterns[pattern] || 0) + 1
  }

  let entropy = 0
  for (const count of Object.values(patterns)) {
    const p = count / possibleWords.length
    entropy -= p * Math.log2(p)
  }
  return entropy
}

module.exports = { getNextGuess }
