// Game State
let balance = 1000;
let betAmount = 10;
let multiplier = 1.0;
let mines = [];
let revealed = [];
let autoCashOutValue = 0;
const historyLog = [];

// DOM Elements
const grid = document.getElementById('grid');
const balanceDisplay = document.getElementById('balance');
const betAmountDisplay = document.getElementById('bet-amount');
const multiplierDisplay = document.getElementById('multiplier');
const cashOutButton = document.getElementById('cash-out');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');
const autoCashOutInput = document.getElementById('auto-cashout-input');
const historyLogElement = document.getElementById('history-log');
const toast = document.getElementById('toast');

// Initialize Game
function initGame() {
    // Create Grid
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.dataset.index = i;
        tile.textContent = '?';
        tile.addEventListener('click', () => handleTileClick(i));
        grid.appendChild(tile);
    }

    // Event Listeners
    cashOutButton.addEventListener('click', cashOut);
    decreaseBetButton.addEventListener('click', () => adjustBet(-5));
    increaseBetButton.addEventListener('click', () => adjustBet(5));
    autoCashOutInput.addEventListener('change', updateAutoCashOut);

    // Start Game
    resetGame();
}

// Handle Tile Clicks
function handleTileClick(index) {
    if (revealed.includes(index)) return;

    revealed.push(index);
    const tile = document.querySelector(`[data-index="${index}"]`);

    if (mines.includes(index)) {
        // Mine Hit
        tile.textContent = '💣';
        tile.style.backgroundColor = '#f44336';
        endGame(false);
    } else {
        // Safe Tile
        tile.textContent = '💎';
        tile.style.backgroundColor = '#4CAF50';
        multiplier += 0.5;
        multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
        
        // Auto Cash-Out Check
        if (autoCashOutValue > 0 && multiplier >= autoCashOutValue) {
            showToast(`Auto-cashed at ${multiplier.toFixed(2)}x!`, true);
            cashOut();
        }
    }
}

// Cash Out
function cashOut() {
    const winAmount = betAmount * multiplier;
    balance += winAmount;
    updateBalance(balance);
    addHistoryEntry(true, winAmount);
    showToast(`You won ${winAmount.toFixed(2)} coins!`, true);
    resetGame();
}

// End Game (Mine Hit)
function endGame() {
    balance -= betAmount;
    updateBalance(balance);
    addHistoryEntry(false, 0);
    showToast(`Boom! Lost ${betAmount} coins`, false);
    setTimeout(resetGame, 1500);
}

// Reset Game State
function resetGame() {
    revealed = [];
    multiplier = 1.0;
    multiplierDisplay.textContent = '1.00x';
    mines = placeMines();
    
    // Reset Tiles
    document.querySelectorAll('.grid div').forEach(tile => {
        tile.textContent = '?';
        tile.style.backgroundColor = '#3a3a3a';
    });
}

// Place Mines Randomly
function placeMines() {
    const mines = [];
    while (mines.length < 3) {
        const randomPos = Math.floor(Math.random() * 25);
        if (!mines.includes(randomPos)) mines.push(randomPos);
    }
    return mines;
}

// Adjust Bet Amount
function adjustBet(amount) {
    const newBet = betAmount + amount;
    if (newBet >= 5 && newBet <= balance) {
        betAmount = newBet;
        betAmountDisplay.textContent = betAmount;
    }
}

// Update Auto Cash-Out
function updateAutoCashOut() {
    autoCashOutValue = parseFloat(autoCashOutInput.value) || 0;
}

// Update Balance with Animation
function updateBalance(newBalance) {
    const isIncrease = newBalance > balance;
    balanceDisplay.classList.add(isIncrease ? 'balance-increase' : 'balance-decrease', 'balance-pulse');
    balanceDisplay.textContent = newBalance;
    balance = newBalance;
    
    setTimeout(() => {
        balanceDisplay.classList.remove('balance-increase', 'balance-decrease', 'balance-pulse');
    }, 1000);
}

// Show Toast Message
function showToast(message, isWin) {
    toast.textContent = message;
    toast.className = isWin ? 'toast toast-win toast-visible' : 'toast toast-loss toast-visible';
    
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000);
}

// Add History Entry
function addHistoryEntry(isWin, amount) {
    const entry = document.createElement('div');
    entry.className = `history-entry ${isWin ? 'win' : 'loss'}`;
    entry.textContent = `${new Date().toLocaleTimeString()}: ${isWin ? 'Won' : 'Lost'} ${isWin ? amount.toFixed(2) : betAmount} coins`;
    historyLogElement.prepend(entry);
}

// Start the Game
initGame();
