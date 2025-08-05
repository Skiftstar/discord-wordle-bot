// Just checks 2 words against each other and what pattern they would produce
const getPattern = (guess, possibleSolution) => {
  guess = guess.toLowerCase()
  possibleSolution = possibleSolution.toLowerCase()
  let pattern = ""
  for (let i = 0; i < possibleSolution.length; i++) {
    if (guess[i] === possibleSolution[i]) {
      pattern += "g"
      continue
    }

    if (possibleSolution.includes(guess[i])) {
      pattern += "y"
      continue
    }

    pattern += "b"
  }
  return pattern
}

// Just returns a subset of 'possibleWords' that produce 'pattern' when pitted against 'guess'
const getWordsThatProducePattern = (possibleWords, pattern, guess) => {
  let possibleSolutions = []
  for (const word of possibleWords) {
    if (getPattern(guess, word) === pattern) possibleSolutions.push(word)
  }
  return possibleSolutions
}

module.exports = { getPattern, getWordsThatProducePattern }
