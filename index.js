const { detectWordRows, getRowPattern } = require("./modules/box-calc.js")
const { getNextEntropyGuess, getMostEliminativeWord } = require("./modules/funny-math.js")
const { loadWordsAndSHA, getLeftOverWords, removeInvalidWords, removeWordPermanently, getFirstGuessFromSHA, confirmSHAValidity, storeNewFirstGuess } = require("./modules/word-handler.js")
const { typeGuess, deleteInvalidGuess } = require("./modules/player.js")
const { getConfigValue } = require("./modules/config.js")
const fs = require('fs')

const playedGuesses = []
let currentRow = 0
let lastGuess = ""
// If true guesses outside the pattern to eliminate as many letters as possible
let elimMode = false
let initalShaValid = true
let firstGuess = true

const main = async () => {
  loadWordsAndSHA()
  await detectWordRows()

  setTimeout(() => {
    console.log("Starting Solver...\n")
    play()
  }, initalShaValid ? 3000 : 0)
}

const play = async () => {
  //Abort Condition
  if (currentRow > 5) {
    console.log("No wins? qwq")
    return
  }
  if (currentRow === 5) elimMode = false // turn off elim mode on last guess

  await getGuess()
  await typeGuess(lastGuess)
  playedGuesses.push(lastGuess)
  firstGuess = false

  console.log("Waiting for animation...")
  setTimeout(async () => {
    const feedbackPattern = await getRowPattern(currentRow)
    console.log("Detected Pattern", feedbackPattern)

    // Win Condition
    if (feedbackPattern === "ggggg") {
      console.log("Won :3")
      return
    }

    // Invalid Guess played
    if (feedbackPattern === "iiiii") {
      handleInvalidGuess()
      return
    }

    removeInvalidWords(feedbackPattern, lastGuess)
    checkElimMode(feedbackPattern)
    currentRow++ 

    console.log("") //empty line
    play()
  }, getConfigValue("ANIMATION_DELAY")) // Delay because discord wordle has animation after submitting
}

const handleInvalidGuess = async () => {
  console.log(`Invalid Guess played...`)
  console.log(`Removing ${lastGuess} from word list!`)
  playedGuesses.pop()

  //Delete guess
  console.log("Deleting guess...")
  await deleteInvalidGuess()

  //Rewrite words file
  console.log("Rewriting words list...")
  removeWordPermanently(lastGuess)

  console.log("Done :D Playing new Guess!\n")
  play()
}

const checkElimMode = (lastPattern) => {
  const possibleWords = getLeftOverWords()
  if (possibleWords.length === 1) {
    elimMode = false
    return
  }
  if (elimMode) return
  if (countLetter(lastPattern, "b") <= getConfigValue("ELIM_MODE_UNKNOWN_TRHESHOLD") && possibleWords.length > 1) {
    elimMode = true
    return
  }
  if (possibleWords.length < getConfigValue("EMIN_MODE_REMAINING_WORDS_TRESHOLD")) {
    elimMode = true
    return
  }
  elimMode = false
}

const countLetter = (word, letter) => word.split(letter).length - 1;

const getGuess = async () => {
  let guess = ""
  const possibleWords = getLeftOverWords()
  if (elimMode) {
    console.log("Calculating ElimMode Guess...")
    guess = getMostEliminativeWord(playedGuesses)
  } else {
    if (firstGuess && await confirmSHAValidity()) {
      guess = { word: getFirstGuessFromSHA() }
    } else {
      console.log("Calculating Entropy Guess...")
      guess = getNextEntropyGuess(possibleWords)
      if (firstGuess) storeNewFirstGuess(guess)
    }
  }
  lastGuess = guess.word
  console.log("Possible Words:", possibleWords.length, "elimMode", elimMode)
  console.log(guess)
  return guess.word
}

main()
