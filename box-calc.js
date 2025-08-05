const os = require('os');
const screenshot = require('screenshot-desktop');
const { createCanvas, loadImage } = require('canvas');
const { execFile } = require('child_process');

const IMAGE_PATH = './screenshot.png';
const SCREENSHOT_X = 0
const SCREENSHOT_Y = 0
const SCREENSHOT_WIDTH = 1920
const SCREENSHOT_HEIGHT = 1080

const CORRECT_COLOR = [83, 141, 78, 255]
const VALID_COLOR = [181, 159, 59, 255]
const WRONG_COLOR = [53, 58, 60, 255]

const takeScreenshot = async () => {
  const platformn = os.platform();
  if (platformn === 'win32') {
    try {
      await screenshot({ filename: IMAGE_PATH });
      return IMAGE_PATH;
    } catch (err) {
      throw new Error(`screenshot-desktop failed: ${err.message}`);
    }
  }
  else {
    return new Promise((resolve, reject) => {
      execFile('./screenshot.sh', [SCREENSHOT_X, SCREENSHOT_Y, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT, IMAGE_PATH], (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve(IMAGE_PATH);
      });
    });
  }
}

const findLetterBoxes = async () => {
  await takeScreenshot()
  const img = await loadImage(IMAGE_PATH);

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const threshold = 30;
  const visited = new Set();
  const boxes = [];

  const isDark = (x, y) => {
    const i = (y * canvas.width + x) * 4;
    return data[i] < threshold && data[i + 1] < threshold && data[i + 2] < threshold;
  };

  const scanBox = (x, y) => {
    let minX = x, minY = y, maxX = x, maxY = y;
    const queue = [[x, y]];
    while (queue.length) {
      const [cx, cy] = queue.pop();
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) continue;
      if (!isDark(cx, cy)) continue;

      minX = Math.min(minX, cx);
      minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cx);
      maxY = Math.max(maxY, cy);

      queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    const w = maxX - minX;
    const h = maxY - minY;
    if (w > 20 && h > 20 && w < 100 && h < 100) {
      boxes.push({ x: minX, y: minY, width: w, height: h });
    }
  };

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const key = `${x},${y}`;
      if (!visited.has(key) && isDark(x, y)) {
        scanBox(x, y);
      }
    }
  }

  // Sort by rows then columns
  boxes.sort((a, b) => {
    const rowA = Math.floor(a.y / 20);
    const rowB = Math.floor(b.y / 20);
    return rowA === rowB ? a.x - b.x : rowA - rowB;
  });

  return boxes
}

const colorCompare = (actual, compare) => {
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== compare[i]) return false
  }
  return true
}

const getPixelState = async (x,y) => {
  const img = await loadImage(IMAGE_PATH);

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');


  ctx.drawImage(img, 0, 0);
  const pixelData = ctx.getImageData(x, y, 1, 1).data;

  if (colorCompare(pixelData, CORRECT_COLOR)) return "g"
  if (colorCompare(pixelData, VALID_COLOR)) return "y"
  return "b"
} 

module.exports = { findLetterBoxes, takeScreenshot, getPixelState }
