# Why?
Idk bro, latenight boredom

# Show?
Okie :3

https://github.com/user-attachments/assets/bc20f38d-b425-4ee9-a83a-1ec32531042c

# Html file?
Just a really really basic version of wordle I created to test the bot lol

# How?
Well currently the bot is quite stupid...

It has a list of possible words `valid-wordle-words.txt` and only checks word entropy.
On every guess, it checks for the word with the highest entropy, takes that as a guess and then checks which pattern it got back as feedback.
After that it eliminates all words that don't fit in this pattern.

Sadly this causes issues when there's only 1 or 2 letters to guess since it won't change its green guesses anymore.
In the future it would be a good idea to have it guess different words to eleminate more letters when needed.

To play and analyze the game, it takes screenshots at the beginning of the game and after each move.
At the start it will find all letter boxes and save their coordinates.
After each move it will check via the saved coordinates what color values the boxes of the row we just played have. This way we can extract the pattern.

Finish Conditions are a "ggggg" pattern or 6 played rows.

# Installation
Only works on Linux
Currently requires `grim` and `wtype`
```
sudo pacman -S grim wtype
```
grim is required to take screenshots
wtype is used for submitting the input

also uses `canvas` to analyze the screenshots
```
npm i
```

# Usage
Open Discord Wordle, make sure it's in *Dark Mode* and that it's *big enough*.
If needed, adjust screenshot area in `box-calc.js`, by default it just screenshots the entire first monitor.

Run
```
node index.js
```
and tab back into discord. 
Let the bot do its thing :)
