# Why?
Idk bro, late night boredom

# Show?
Okie :3

https://github.com/user-attachments/assets/98b18ef6-7aac-4098-80c5-94433fb18b79

https://github.com/user-attachments/assets/67b53153-a027-4f14-be22-fb1b722fb931

# Installation
## Linux
Currently requires `grim` and `wtype`
```
sudo pacman -S grim wtype
```
grim is required to take screenshots
wtype is used for submitting the input

also uses `canvas` to analyze the screenshots. Sadly we have `screenshot-desktop` as bloat as well, as it's needed on windows.
```
npm i
```

Make the screenshot script executeable
```
chmod +x modules/screenshot.sh
```

## Windows

Download [NirCmd](https://www.nirsoft.net/utils/nircmd.html) (Scroll to bottom of site and click "Downlaod NirCmd")

Unzip archive and put NirCmd.exe inside the `modules` folder. NirCmd is used to input keystrokes.

Install npm packages `canvas` for screenshot analyzing and `screenshot-desktop` for screenshot taking
```
npm i
```

# Usage
Open Discord Wordle, make sure it's in **Dark Mode** and that it's **big enough**. Make sure only the playfield is visible and none of previews of other users (just decrease window width for this), just like in the demo video above.

If needed, adjust screenshot area in `modules/box-calc.js` (**Only works on Linux! Windows just screenshots your entire first desktop!**)

Run
```
node index.js
```
and tab back into discord. 
Let the bot do its thing :)


# How?
The solvers keeps track of a list of possible solutions, originating from `valid-wordle-words.txt`.
After every guess, it will analyze the pattern and eliminate words that don't fall into this pattern.

The Solver has 2 mode:
- Entropy Mode, where it checks for the word with the highest entropy and uses this as its guess
- Elimination mode, if only two letters or less than 10 possible solutions remain, the solver will ignore the pattern and eliminate as many remaining letters as possible.
it will do so until only 1 word remains or it reaches its final guess.

To play and analyze the game, it takes screenshots at the beginning of the game and after each move.
At the start it will find all letter boxes and save their coordinates.
After each move it will check via the saved coordinates what color values the boxes of the row we just played have. This way we can extract the pattern.

Finish Conditions are a "ggggg" pattern or 6 played rows.

# Sha file?
Yeah I store the sha of the word list so that I can skip the first guess calculation, since that one will always be the same if the word list doesn't change.
Also keep in mind if you change the word list, that the first guess calculation will take a bit.
Sha file updates automagically.

# Html file?
Just a really really basic version of wordle I created to test the bot lol

# Discord ToS?
We don't interact with Discord directly. The solver just takes screenshots, evaluates them and sends keystroke events via wtype.

# Todos?
- Still needs some form of detection when a word is not valid, because I think my word list is longer than the one the NYTimes uses. Just waiting for a real-life case to check
