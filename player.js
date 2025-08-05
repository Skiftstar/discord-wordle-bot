const { exec } = require('child_process');

// basically just uses wtype to submit the guess
// maybe use an sh script instead?
const typeGuess = async (guess) => {
  return new Promise((resolve, reject) => {
    exec(`wtype "${guess}" && wtype -P return`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = { typeGuess }
