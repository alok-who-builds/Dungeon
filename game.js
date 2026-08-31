// ---- Grid setup ----
const COLS = 21;
const ROWS = 15;

// Map layout: 1 = wall, 0 = floor
// has branches and dead ends
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

// player starts here
let player = { x: 1, y: 1 };
const exitTile = { x: 19, y: 1 };

// message under the grid
const messageEl = document.getElementById('message');

const gridEl = document.getElementById('grid');

// keep the tiles here so we don't have to make them again
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

// redraw the player when they move
let lastPlayerPos = { x: player.x, y: player.y };

function draw() {
  tileEls[lastPlayerPos.y][lastPlayerPos.x].classList.remove('player');
  tileEls[player.y][player.x].classList.add('player');

  lastPlayerPos = { x: player.x, y: player.y };
}

// check if there is a wall
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

// ---- Keyboard controls ----
// Arrow keys and WASD move the player
// Tab is blocked
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      tryMove(0, -1);
      break;

    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      tryMove(0, 1);
      break;

    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      tryMove(-1, 0);
      break;

    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      tryMove(1, 0);
      break;

    case 'Tab':
      e.preventDefault();
      break;
  }
});

// no mouse controls

// ---- Init ----
buildGrid();
draw();
