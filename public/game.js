class Minesweeper {
    constructor() {
        this.board = [];
        this.mines = [];
        this.revealed = [];
        this.flagged = [];
        this.rows = 16;
        this.cols = 16;
        this.totalMines = 40;
        this.gameOver = false;
        this.timer = 0;
        this.timerInterval = null;
        this.firstClick = true;
        
        this.init();
    }
    
    init() {
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('new-game');
        this.restartBtn = document.getElementById('restart');
        this.gameBoard = document.getElementById('game-board');
        this.minesCountEl = document.getElementById('mines-count');
        this.timerEl = document.getElementById('timer');
        this.statusEl = document.getElementById('status');
        this.gameOverEl = document.getElementById('game-over');
        this.gameOverTitle = document.getElementById('game-over-title');
        this.gameOverMessage = document.getElementById('game-over-message');
        
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.restartBtn.addEventListener('click', () => this.startNewGame());
        this.difficultySelect.addEventListener('change', () => this.startNewGame());
        
        this.startNewGame();
    }
    
    startNewGame() {
        const difficulty = this.difficultySelect.value;
        
        switch(difficulty) {
            case 'easy':
                this.rows = 9;
                this.cols = 9;
                this.totalMines = 10;
                break;
            case 'medium':
                this.rows = 16;
                this.cols = 16;
                this.totalMines = 40;
                break;
            case 'hard':
                this.rows = 16;
                this.cols = 30;
                this.totalMines = 99;
                break;
        }
        
        this.resetGame();
        this.createBoard();
        this.updateMinesCount();
        this.stopTimer();
        this.timer = 0;
        this.updateTimer();
        this.gameOverEl.classList.add('hidden');
        this.statusEl.textContent = '😃';
    }
    
    resetGame() {
        this.board = [];
        this.mines = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.firstClick = true;
        
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            this.mines[i] = [];
            this.revealed[i] = [];
            this.flagged[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
                this.mines[i][j] = false;
                this.revealed[i][j] = false;
                this.flagged[i][j] = false;
            }
        }
    }
    
    placeMines(excludeRow, excludeCol) {
        let placed = 0;
        while (placed < this.totalMines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            // 确保不在第一次点击的位置及其周围放置地雷
            const isExcluded = Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1;
            
            if (!this.mines[row][col] && !isExcluded) {
                this.mines[row][col] = true;
                placed++;
            }
        }
        
        // 计算每个格子周围的地雷数
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.mines[i][j]) {
                    this.board[i][j] = this.countAdjacentMines(i, j);
                }
            }
        }
    }
    
    countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                    if (this.mines[newRow][newCol]) count++;
                }
            }
        }
        return count;
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 35px)`;
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', (e) => this.handleClick(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(i, j);
                });
                
                this.gameBoard.appendChild(cell);
            }
        }
    }
    
    handleClick(row, col) {
        if (this.gameOver || this.revealed[row][col] || this.flagged[row][col]) return;
        
        // 第一次点击时放置地雷
        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(row, col);
            this.startTimer();
        }
        
        if (this.mines[row][col]) {
            this.gameOver = true;
            this.revealAllMines();
            this.showGameOver(false);
            this.statusEl.textContent = '😵';
            this.stopTimer();
        } else {
            this.revealCell(row, col);
            this.checkWin();
        }
        
        this.updateBoard();
    }
    
    handleRightClick(row, col) {
        if (this.gameOver || this.revealed[row][col]) return;
        
        this.flagged[row][col] = !this.flagged[row][col];
        this.updateMinesCount();
        this.updateBoard();
    }
    
    revealCell(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
        if (this.revealed[row][col] || this.flagged[row][col]) return;
        
        this.revealed[row][col] = true;
        
        if (this.board[row][col] === 0) {
            // 如果周围没有地雷，递归揭开周围的格子
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    this.revealCell(row + i, col + j);
                }
            }
        }
    }
    
    revealAllMines() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.mines[i][j]) {
                    this.revealed[i][j] = true;
                }
            }
        }
    }
    
    checkWin() {
        let revealedCount = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.revealed[i][j]) revealedCount++;
            }
        }
        
        const totalCells = this.rows * this.cols;
        const nonMineCells = totalCells - this.totalMines;
        
        if (revealedCount === nonMineCells) {
            this.gameOver = true;
            this.showGameOver(true);
            this.statusEl.textContent = '🎉';
            this.stopTimer();
        }
    }
    
    showGameOver(win) {
        this.gameOverEl.classList.remove('hidden');
        if (win) {
            this.gameOverTitle.textContent = '🎉 恭喜你赢了！';
            this.gameOverMessage.textContent = `用时 ${this.timer} 秒！太棒了！`;
        } else {
            this.gameOverTitle.textContent = '💥 游戏结束！';
            this.gameOverMessage.textContent = '踩到地雷了，再试一次吧！';
        }
    }
    
    updateBoard() {
        const cells = this.gameBoard.children;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const index = i * this.cols + j;
                const cell = cells[index];
                
                cell.className = 'cell';
                cell.textContent = '';
                delete cell.dataset.number;
                
                if (this.revealed[i][j]) {
                    cell.classList.add('revealed');
                    if (this.mines[i][j]) {
                        cell.classList.add('mine');
                        cell.textContent = '💣';
                    } else if (this.board[i][j] > 0) {
                        cell.textContent = this.board[i][j];
                        cell.dataset.number = this.board[i][j];
                    }
                } else if (this.flagged[i][j]) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }
            }
        }
    }
    
    updateMinesCount() {
        let flaggedCount = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.flagged[i][j]) flaggedCount++;
            }
        }
        this.minesCountEl.textContent = this.totalMines - flaggedCount;
    }
    
    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        this.timerEl.textContent = String(this.timer).padStart(3, '0');
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
