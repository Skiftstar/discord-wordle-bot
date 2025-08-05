const { findLetterBoxes, takeScreenshot, getPixelState } = require("./box-calc.js")
const { getNextGuess } = require("./funny-math.js")
const { getWordsThatProducePattern } = require("./wordle-calc.js")
const { typeGuess } = require("./player.js")
const fs = require('fs')

const POSSIBLE_WORDS_TXT = "./valid-wordle-words.txt"
const words = fs.readFileSync(POSSIBLE_WORDS_TXT)
let possibleWords = words.toString().split("\n")

const boxRows = []
let currentRow = 0
let lastGuess = ""

// has a 10x margin to count smth as one row incase the box detection isn't accurate
// also automatically yeets every row that doesn't have 5 boxes
const getBoxRows = (boxes) => {
  do {
    const boxY = boxes[0].y
    const boxesInRow = boxes.filter(box => box.y > boxY - 10 && box.y < boxY + 10)
    if (boxesInRow.length === 5) boxRows.push(boxesInRow)
    boxes = boxes.filter(box => !(box.y > boxY - 10 && box.y < boxY + 10));
  } while (boxes.length > 0)
  console.log(boxRows)
}

// small margin towards the middle of the box to make sure we hit it 100% of the time
const getBoxPixel = (rowIndex, letterIndex) => {
  const box = boxRows[rowIndex][letterIndex]
  return {x: box.x + 1, y: box.y + 1}
}

const main = async () => {
  let boxes = await findLetterBoxes()
  if (boxes.length === 0) {
    console.log("No boxes found :o")
    return
  }
  getBoxRows(boxes)
  play()
}

const play = async () => {
  //Abort Condition
  if (currentRow > 5) return

  getGuess()
  await typeGuess(lastGuess)
  setTimeout(async () => {
    const feedbackPattern = await getRowPattern()
    console.log(feedbackPattern)

    // Win Condition
    if (feedbackPattern === "ggggg") return

    filterWords(feedbackPattern)
    currentRow++ 
    play()
  }, 3000) // Delay because discord wordle has animation after submitting
}

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
  const guess = getNextGuess(possibleWords)
  lastGuess = guess.word
  console.log("Possible Words:", possibleWords.length)
  console.log(guess)
}

main()
