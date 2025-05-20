// Game state
let balance = 1000;
let betAmount = 10;
let multiplier = 1.0;
let mines = [];
let revealed = [];
let gameActive = false;
let currentWin = 0;
const historyLog = [];

// DOM elements
const grid = document.getElementById('grid');
const balanceDisplay = document.getElementById('balance');
const betAmountDisplay = document.getElementById('bet-amount');
const multiplierDisplay = document.getElementById('multiplier');
const cashOutButton = document.getElementById('cash-out');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');
const historyLogElement = document.getElementById('history-log');

// Initialize game
function initGame() {
  // Create grid tiles
  for (let i = 0; i < 25; i++) {
    const tile = document.createElement('div');
    tile.dataset.index = i;
    tile.textContent = '?';
    tile.addEventListener('click', () => handleTileClick(i));
    grid.appendChild(tile);
  }
  
  // Event listeners
  cashOutButton.addEventListener('click', cashOut);
  decreaseBetButton.addEventListener('click', () => adjustBet(-5));
  increaseBetButton.addEventListener('click', () => adjustBet(5));
  
  // Start first game
  resetGame();
}

// Handle tile click
function handleTileClick(index) {
  if (!gameActive || revealed.includes(index)) return;
  
  revealed.push(index);
  const tile = document.querySelector(`[data-index="${index}"]`);
  
  if (mines.includes(index)) {
    // Hit a mine
    tile.textContent = '💣';
    tile.style.backgroundColor = '#f44336';
    gameActive = false;
    balance -= betAmount;
    updateBalance();
    addHistoryEntry(false, 0);
    setTimeout(() => alert(`Game Over! You lost ${betAmount} coins.`), 100);
  } else {
    // Safe tile
    tile.textContent = '💎';
    tile.style.backgroundColor = '#4CAF50';
    multiplier += 0.5;
    currentWin = betAmount * multiplier;
    multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
  }
}

// Cash out
function cashOut() {
  if (!gameActive || revealed.length === 0) return;
  
  balance += currentWin;
  updateBalance();
  addHistoryEntry(true, currentWin);
  resetGame();
}

// Adjust bet amount
function adjustBet(amount) {
  const newBet = betAmount + amount;
  if (newBet >= 5 && newBet <= balance) {
    betAmount = newBet;
    betAmountDisplay.textContent = betAmount;
  }
}

// Reset game state
function resetGame() {
  revealed = [];
  multiplier = 1.0;
  currentWin = 0;
  gameActive = true;
  multiplierDisplay.textContent = '1.00x';
  mines = placeMines();
  
  // Reset tiles
  document.querySelectorAll('.grid div').forEach(tile => {
    tile.textContent = '?';
    tile.style.backgroundColor = '#3a3a3a';
  });
}

// Place mines randomly (3 mines)
function placeMines() {
  const mines = [];
  while (mines.length < 3) {
    const randomPos = Math.floor(Math.random() * 25);
    if (!mines.includes(randomPos)) mines.push(randomPos);
  }
  return mines;
}

// Update balance display
function updateBalance() {
  balanceDisplay.textContent = balance;
}

// Add entry to history log
function addHistoryEntry(isWin, amount) {
  const entry = document.createElement('div');
  entry.className = `history-entry ${isWin ? 'win' : 'loss'}`;
  
  const date = new Date().toLocaleTimeString();
  if (isWin) {
    entry.textContent = `${date}: Won ${amount.toFixed(2)} coins (${multiplier.toFixed(2)}x)`;
  } else {
    entry.textContent = `${date}: Lost ${betAmount} coins`;
  }
  
  historyLog.unshift(entry);
  historyLogElement.prepend(entry);
  
  // Keep only last 10 entries
  if (historyLog.length > 10) {
    historyLog.pop();
    historyLogElement.removeChild(historyLogElement.lastChild);
  }
}

// Start the game
initGame();
