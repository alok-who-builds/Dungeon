// ---- Grid setup ----
const COLS = 21;
const ROWS = 15;

// 1 = wall, 0 = floor
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

let player = { x: 1, y: 1 };
const exitTile = { x: 19, y: 1 };

const messageEl = document.getElementById('message');
const gridEl = document.getElementById('grid');

const tileEls = [];

function buildGrid() {
  for (let y = 0; y < ROWS; y++) {
    const row = [];

    for (let x = 0; x < COLS; x++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      if (map[y][x] === 1) {
        tile.classList.add('wall');
      }

      if (x === exitTile.x && y === exitTile.y) {
        tile.classList.add('exit');
      }

      gridEl.appendChild(tile);
      row.push(tile);
    }

    tileEls.push(row);
  }
}

let lastPlayerPos = { x: player.x, y: player.y };

function draw() {
  tileEls[lastPlayerPos.y][lastPlayerPos.x].classList.remove('player');
  tileEls[player.y][player.x].classList.add('player');

  lastPlayerPos = { x: player.x, y: player.y };
}

function isWall(x, y) {
  if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return true;
  return map[y][x] === 1;
}

let levelWon = false;

function tryMove(dx, dy) {
  if (levelWon) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (!isWall(newX, newY)) {
    player.x = newX;
    player.y = newY;

    draw();
    checkWin();
  }
}

function checkWin() {
  if (player.x === exitTile.x && player.y === exitTile.y) {
    levelWon = true;
    messageEl.textContent = 'Floor cleared! You found the way out.';
  }
}

// ---- Typing-to-move ----
const wordList = [
  'shadow',
  'flicker',
  'hollow',
  'ember',
  'wander',
  'silent',
  'crawl',
  'echo'
];

let currentWordIndex = 0;
let armedDirection = null;
let typedBuffer = '';

const wordTargetEl = document.getElementById('word-target');
const typedBufferEl = document.getElementById('typed-buffer');
const directionIconEl = document.getElementById('direction-icon');

const directionMap = {
  ArrowUp: { dx: 0, dy: -1, icon: '↑' },
  ArrowDown: { dx: 0, dy: 1, icon: '↓' },
  ArrowLeft: { dx: -1, dy: 0, icon: '←' },
  ArrowRight: { dx: 1, dy: 0, icon: '→' },
};

function updateDirectionIcon() {
  directionIconEl.textContent = armedDirection
    ? armedDirection.icon
    : '(pick a direction)';
}

function updateWordTarget() {
  wordTargetEl.textContent = wordList[currentWordIndex];
}

function updateTypedDisplay() {
  typedBufferEl.textContent = typedBuffer;
}

function checkWordAndMove() {
  if (!armedDirection) return;

  const targetWord = wordList[currentWordIndex];

  if (typedBuffer.toLowerCase() === targetWord) {
    tryMove(armedDirection.dx, armedDirection.dy);

    currentWordIndex = (currentWordIndex + 1) % wordList.length;
    typedBuffer = '';

    updateDirectionIcon();
    updateWordTarget();
    updateTypedDisplay();
  } else {
    typedBuffer = '';
    updateTypedDisplay();
  }
}

// ---- Keyboard controls ----
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
  }

  if (e.repeat) return;

  if (key === 'Tab') {
    e.preventDefault();
    return;
  }

  if (levelWon) return;

  if (directionMap[key]) {
    e.preventDefault();
    armedDirection = directionMap[key];
    updateDirectionIcon();
    return;
  }

  if (key === 'Enter') {
    e.preventDefault();
    checkWordAndMove();
    return;
  }

  if (key === 'Backspace') {
    e.preventDefault();
    typedBuffer = typedBuffer.slice(0, -1);
    updateTypedDisplay();
    return;
  }

  if (key.length === 1 && /[a-zA-Z]/.test(key)) {
    e.preventDefault();
    typedBuffer += key.toLowerCase();
    updateTypedDisplay();
  }
});

window.addEventListener('blur', () => {
  typedBuffer = '';
  updateTypedDisplay();
});

// ---- Init ----
buildGrid();
draw();
updateWordTarget();
updateDirectionIcon();
updateTypedDisplay();
