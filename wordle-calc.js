const setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

// Just checks 2 words against each other and what pattern they would produce
const getPattern = (guess, possibleSolution) => {
  guess = guess.toLowerCase()
  possibleSolution = possibleSolution.toLowerCase()
  let pattern = ["b", "b", "b", "b", "b"]
  for (let i = 0; i < possibleSolution.length; i++) {
    if (guess[i] === possibleSolution[i]) {
      pattern[i] = "g"
      possibleSolution = setCharAt(possibleSolution, i, "-")
      guess = setCharAt(guess, i, "_")
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (possibleSolution.includes(guess[i])) {
      pattern[i] = "y"
      const charIndex = possibleSolution.indexOf(guess[i])
      possibleSolution = setCharAt(possibleSolution, charIndex, "-")
    }
  }

  return pattern.join("")
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
