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

const getWordsThatProducePattern = (possibleWords, pattern, guess) => {
  let possibleSolutions = []
  for (const word of possibleWords) {
    if (getPattern(guess, word) === pattern) possibleSolutions.push(word)
  }
  return possibleSolutions
}

module.exports = { getPattern, getWordsThatProducePattern }
