const { findLetterBoxes, takeScreenshot, getPixelState } = require("./box-calc.js")
const { getNextEntropyGuess, getMostEliminativeWord } = require("./funny-math.js")
const { getWordsThatProducePattern } = require("./wordle-calc.js")
const { typeGuess } = require("./player.js")
const fs = require('fs')
const crypto = require('crypto');

const POSSIBLE_WORDS_TXT = "./valid-wordle-words.txt"
const SHA_FILE = "./word-list-sha.txt"
const words = fs.readFileSync(POSSIBLE_WORDS_TXT)
let possibleWords = words.toString().split("\n")
// Will be used if we need to reference all words again
// for mass elimination mode at the end
const allWords = words.toString().split("\n")

const sha_read = fs.readFileSync(SHA_FILE)
let stored_sha = sha_read.toString().split("\n")[0]
let initialShaGuess = sha_read.toString().split("\n")[1]

const boxRows = []
const playedGuesses = []
let currentRow = 0
let lastGuess = ""
// If true guesses outside the pattern to eliminate as many letters as possible
let elimMode = false
let initalShaValid = true
let firstGuess = true

const main = async () => {

  console.log("Checking File Hash...")
  const wordListHash = await getFileHash(POSSIBLE_WORDS_TXT)
  if (wordListHash !== stored_sha) {
    initalShaValid = false
    stored_sha = wordListHash
    console.log("Hash not valid, first guess might take a while...")
  } else {
    console.log("Hash valid, using stored first guess!")
  }

  let boxes = await findLetterBoxes()
  if (boxes.length === 0) {
    console.log("No boxes found :o")
    return
  }
  getBoxRows(boxes)
  setTimeout(() => {
    play()
  }, initalShaValid ? 3000 : 0)
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

const storeNewSha = (newFirstGuess) => {
  console.log("Storing new Hash and first guess...")
  fs.writeFileSync(SHA_FILE, `${stored_sha}\n${newFirstGuess}`)
  console.log("Stored first Hash!")
}

// has a 10x margin to count smth as one row incase the box detection isn't accurate
// also automatically yeets every row that doesn't have 5 boxes
const getBoxRows = (boxes) => {
  console.log("Detecting Letterboxes...")
  do {
    const boxY = boxes[0].y
    const boxesInRow = boxes.filter(box => box.y > boxY - 10 && box.y < boxY + 10)
    if (boxesInRow.length === 5) boxRows.push(boxesInRow)
    boxes = boxes.filter(box => !(box.y > boxY - 10 && box.y < boxY + 10));
  } while (boxes.length > 0)
  console.log("Detected", boxRows.length, "rows!")
}

// small margin towards the middle of the box to make sure we hit it 100% of the time
const getBoxPixel = (rowIndex, letterIndex) => {
  const box = boxRows[rowIndex][letterIndex]
  return {x: box.x + 1, y: box.y + 1}
}


const play = async () => {
  //Abort Condition
  if (currentRow > 5) {
    console.log("No wins? qwq")
    return
  }
  if (currentRow === 5) elimMode = false // turn off elim mode on last guess

  getGuess()
  await typeGuess(lastGuess)
  playedGuesses.push(lastGuess)
  setTimeout(async () => {
    const feedbackPattern = await getRowPattern()
    console.log("Detected Pattern", feedbackPattern)

    // Win Condition
    if (feedbackPattern === "ggggg") {
      console.log("Won :3")
      return
    }

    filterWords(feedbackPattern)
    checkElimMode(feedbackPattern)
    currentRow++ 
    firstGuess = false
    play()
  }, 3000) // Delay because discord wordle has animation after submitting
}

const checkElimMode = (lastPattern) => {
  if (possibleWords.length === 1) {
    elimMode = false
    return
  }
  if (countLetter(lastPattern, "b") === 1 && possibleWords.length > 1) {
    elimMode = true
    return
  }
  if (possibleWords.length < 10) {
    elimMode = true
    return
  }
  elimMode = false
}


const countLetter = (word, letter) => word.split(letter).length - 1;

// Gets pattern of the row that was last submitted
// in the format of "xxxxx" where x can be g y or b
// for a green, yellow, black square
const getRowPattern = async () => {
  await takeScreenshot()
  let pattern = ""
  for (let i = 0; i < 5; i++ ) {
    const {x,y} = getBoxPixel(currentRow, i)
    const state = await getPixelState(x,y)
    pattern += state
  }
  return pattern
}

// remove words that don't fit the pattern
const filterWords = (feedbackPattern) => {
  possibleWords = getWordsThatProducePattern(possibleWords, feedbackPattern, lastGuess)
}

const getGuess = () => {
  let guess = ""
  if (elimMode) {
    guess = getMostEliminativeWord(allWords, possibleWords, playedGuesses)
  } else {
    if (initalShaValid && firstGuess) {
      guess = { word: initialShaGuess }
    } else {
      guess = getNextEntropyGuess(possibleWords)
      if (firstGuess) storeNewSha(guess)
    }
  }
  lastGuess = guess.word
  console.log("Possible Words:", possibleWords.length, "elimMode", elimMode)
  console.log(guess)
}

main()
