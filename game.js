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

const playerEl = document.createElement('div');
playerEl.classList.add('player-piece');
gridEl.appendChild(playerEl);

function draw() {
  const x = player.x * 28;
  const y = player.y * 28;

  playerEl.style.transform = `translate(${x}px, ${y}px)`;
}

function isWall(x, y) {
  if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return true;
  return map[y][x] === 1;
}

function getOpenDirections(x, y) {
  const directions = [];

  if (!isWall(x, y - 1)) directions.push({ dx: 0, dy: -1 });
  if (!isWall(x, y + 1)) directions.push({ dx: 0, dy: 1 });
  if (!isWall(x - 1, y)) directions.push({ dx: -1, dy: 0 });
  if (!isWall(x + 1, y)) directions.push({ dx: 1, dy: 0 });

  return directions;
}

let levelWon = false;
let moving = false;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryMove(dx, dy) {
  if (levelWon || moving) return;

  moving = true;

  while (true) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (isWall(newX, newY)) {
      break;
    }

    player.x = newX;
    player.y = newY;

    draw();

    if (player.x === exitTile.x && player.y === exitTile.y) {
      checkWin();
      break;
    }

    await wait(70);

    const openDirections = getOpenDirections(player.x, player.y);

    const otherDirections = openDirections.filter(direction => {
      return !(direction.dx === -dx && direction.dy === -dy);
    });

    if (otherDirections.length > 1) {
      break;
    }

    if (isWall(player.x + dx, player.y + dy)) {
      break;
    }
  }

  moving = false;
}

// ---- Win check ----
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
  'echo',
  'dark',
  'ghost',
  'chase',
  'escape',
  'danger',
  'mist',
  'stone',
  'night',
  'fear',
  'run',
  'deep',
  'lost',
  'trap',
  'maze',
  'dead',
  'flame',
  'blood',
  'cold',
  'creep',
  'alone',
  'curse',
  'dread',
  'haunt',
  'break',
  'hide',
  'rush',
  'watch',
  'stalk',
  'drift',
  'panic',
  'quiet'
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

async function checkWordAndMove() {
  if (!armedDirection || moving) return;

  const targetWord = wordList[currentWordIndex];

  if (typedBuffer.toLowerCase() === targetWord) {
    let newWordIndex = Math.floor(Math.random() * wordList.length);

    while (newWordIndex === currentWordIndex) {
      newWordIndex = Math.floor(Math.random() * wordList.length);
    }

    currentWordIndex = newWordIndex;
    typedBuffer = '';

    updateDirectionIcon();
    updateWordTarget();
    updateTypedDisplay();

    await tryMove(armedDirection.dx, armedDirection.dy);
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
