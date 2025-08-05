const { findLetterBoxes, takeScreenshot, getPixelState } = require("./box-calc.js")
const { getNextGuess } = require("./funny-math.js")
const { getWordsThatProducePattern } = require("./wordle-calc.js")
const { typeGuess } = require("./player.js")
const fs = require('fs')

const POSSIBLE_WORDS_TXT = "./valid-wordle-words.txt"
const words = fs.readFileSync(POSSIBLE_WORDS_TXT)
let possibleWords = words.toString().split("\n")
console.log(possibleWords)

const boxRows = []
let currentRow = 0
let lastGuess = ""

const getBoxRows = (boxes) => {
  do {
    const boxY = boxes[0].y
    const boxesInRow = boxes.filter(box => box.y > boxY - 10 && box.y < boxY + 10)
    if (boxesInRow.length === 5) boxRows.push(boxesInRow)
    boxes = boxes.filter(box => !(box.y > boxY - 10 && box.y < boxY + 10));
  } while (boxes.length > 0)
  console.log(boxRows)
}

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
  if (currentRow > 5) return
  getGuess()
  await typeGuess(lastGuess)
  setTimeout(async () => {
    const feedbackPattern = await getRowPattern()
    console.log(feedbackPattern)
    if (feedbackPattern === "ggggg") return
    filterWords(feedbackPattern)
    currentRow++ 
    play()
  }, 3000)
}

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

const filterWords = (feedbackPattern) => {
  possibleWords = getWordsThatProducePattern(possibleWords, feedbackPattern, lastGuess)
}

const getGuess = () => {
  const guess = getNextGuess(possibleWords)
  lastGuess = guess.word
  console.log(guess)
}

main()
