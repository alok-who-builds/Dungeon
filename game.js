// c/onw i am going to start  
/// ---- Grid setup ----
const COLS = 15;
const ROWS = 10;

// Map layout: 1 = wall, 0 = floor
// 
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,1,0,1,1,1,1,1,0,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,1,0,0,1],
  [1,0,1,1,1,1,0,1,0,1,0,1,0,0,1],
  [1,0,0,0,0,1,0,1,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,0,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Player state
let player = { x: 1, y: 1 };

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
      gridEl.appendChild(tile);
      row.push(tile);
    }
    tileEls.push(row);
  }
}

// Redraw only the player ki position (clear old, mark new)
let lastPlayerPos = { x: player.x, y: player.y };

function draw() {
  // remove player class from old tile
  tileEls[lastPlayerPos.y][lastPlayerPos.x].classList.remove('player');
  // add it to current tile
  tileEls[player.y][player.x].classList.add('player');
  lastPlayerPos = { x: player.x, y: player.y };
}

// Check if a tile is walkable  - sahi hai
function isWall(x, y) {
  if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return true; // out of bounds = wall
  return map[y][x] === 1;
}

function tryMove(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (!isWall(newX, newY)) {
    player.x = newX;
    player.y = newY;
    draw();
  }
}

// ---- Keyboard-only controls ----
// Arrow keys + WASD move the player. after meal i'll type next 
// Tab is explicitly blocked so it can never shift focus or do anything.acc to rule bug tab fixed now 
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
      e.preventDefault(); // Tab does nothing, ever
      break;
  }
});

// No click listeners anywhere on purpose the mouse simply
// cannot interact with this game.and yahi toh rule tha naah good 

// ---- Init ----
buildGrid();
draw();