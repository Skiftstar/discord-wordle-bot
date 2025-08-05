const { getPattern, getWordsThatProducePattern } = require("./wordle-calc.js")
const fs = require("fs")

const POSSIBLE_WORDS_TXT = "./valid-wordle-words.txt"
const words = fs.readFileSync(POSSIBLE_WORDS_TXT)
let possibleWords = words.toString().split("\n")

// console.log(getPattern("tares", "tases"))
// console.log(getPattern("aahed", "named"))
// console.log(getPattern("funny", "named"))
// console.log(getPattern("aimed", "named"))
// console.log(getPattern("nanua", "named"))
// console.log(getPattern("nanua", "funny"))
// console.log(getPattern("funny", "funny"))
console.log(getPattern("liana", "aliya"))
console.log(getWordsThatProducePattern(possibleWords, "yyybg", "liana"))

