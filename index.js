const { findLetterBoxes, takeScreenshot, getPixelState } = require("./box-calc.js")

const boxRows = []

const getBoxRows = (boxes) => {
  do {
    const boxY = boxes[0].y
    const boxesInRow = boxes.filter(box => box.y > boxY - 10 && box.y < boxY + 10)
    boxRows.push(boxesInRow)
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
  setTimeout(async () => {
    await takeScreenshot()
    const {x,y} = getBoxPixel(0,0)
    const state = await getPixelState(x,y)
    console.log(state)
  }, 5000)

}

main()
