const { exec } = require('child_process');
const os = require('os');
const path = require('path');

const typeGuess = async (guess) => {
  return new Promise((resolve, reject) => {
    // Windows with nircmd
    if (os.platform() === 'win32') {
      const nircmdPath = path.join(__dirname, 'nircmd.exe');
      console.log(nircmdPath)
      let command = ""
      guess.split("").forEach((letter) => {
        command += `${nircmdPath} sendkeypress ${letter} && `;
      })
      command += `${nircmdPath} sendkeypress enter`

      exec(command, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout);
      });
    } else {
      // Linux with use wtype
      exec(`wtype "${guess}" && wtype -P return`, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout);
      });
    }
  });
};

module.exports = { typeGuess }
