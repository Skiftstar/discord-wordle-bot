const { getPattern } = require("./wordle-calc.js")
const { getLeftOverWords, getAllWords } = require("./word-handler.js")

const getNextEntropyGuess = (possibleWords) => {
  let bestGuess = { entropy: -1, word: "" }
  for (const word of possibleWords) {
    const entropy = getWordEntropy(possibleWords, word)
    if (entropy > bestGuess.entropy) {
      bestGuess = {entropy, word}
    }
  }
  return bestGuess
}

const getWordEntropy = (possibleWords, wordToCheck) => {
  // Get all patterns against all possible words
  const patterns = {}
  for (const word of possibleWords) {
    const pattern = getPattern(wordToCheck, word)
    patterns[pattern] = (patterns[pattern] || 0) + 1
  }

  // Calculate entropy based on patterns
  let entropy = 0
  for (const count of Object.values(patterns)) {
    const p = count / possibleWords.length
    entropy -= p * Math.log2(p)
  }
  return entropy
}


const getUnusedLetters = (guessedWords, possibleWords) => {
  const used = new Set(guessedWords.join('').split(''))
  const lettersFromPossibleWords = new Set(possibleWords.join('').split(''))
  return [...lettersFromPossibleWords].filter(c => !used.has(c));
};

const getMostEliminativeWord = (guessedWords) => {
  const possibleWords = getLeftOverWords()
  const allWords = getAllWords()

  const unusedLetters = getUnusedLetters(guessedWords, possibleWords)

  const overlapWords = allWords
    .map(word => {
      const unique = new Set(word);
      const overlap = [...unique].filter(c => unusedLetters.includes(c));
      return { word, score: overlap.length };
    })
    .sort((a, b) => b.score - a.score)

  const wordsWithHighestScore = overlapWords.filter(word => word.score === overlapWords[0].score) 

  // Out of all words with highest ElimScore, use the one with the highest entropy
  let bestWord = { entropy: -1, word: "", score: wordsWithHighestScore[0].score}
  for (const word of wordsWithHighestScore) {
    const entropy = getWordEntropy(possibleWords, word.word)
    if (entropy > bestWord.entropy) {
      bestWord = {entropy, word: word.word, score: word.score}
    }
  }
  return bestWord
  

  //check if any words are in the possibleSolutions, if so, pick one of them
  // for (const word of wordsWithHighestScore) {
  //   if (possibleWords.includes(word.word)) {
  //     return word
  //   }
  // }
  // return wordsWithHighestScore[0]
};

module.exports = { getNextEntropyGuess, getMostEliminativeWord }
