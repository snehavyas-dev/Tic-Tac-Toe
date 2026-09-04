class Gameboard {
	constructor() {
		this.board = ["", "", "", "", "", "", "", "", ""];
	}

	getBoard() {
		return [...this.board];
	}

	placeMark(index, mark) {
		if (this.board[index] !== "") {
			return false;
		}

		this.board[index] = mark;
		return true;
	}

	reset() {
		this.board.fill("");
	}
}

class Player {
	constructor(name, mark) {
		this.name = name;
		this.mark = mark;
	}
}

class GameController {
	constructor(gameboard) {
		this.gameboard = gameboard;
		this.winningCombinations = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		this.players = [];
		this.currentPlayer = null;
		this.gameActive = false;
		this.scores = { X: 0, O: 0 };
	}

	startGame(playerOneName, playerTwoName) {
		this.players = [
			new Player(playerOneName, "X"),
			new Player(playerTwoName, "O"),
		];
		this.currentPlayer = this.players[0];
		this.gameActive = true;
		this.scores = { X: 0, O: 0 };
		this.gameboard.reset();

		return this.currentPlayer;
	}

	hasWinner(mark) {
		const board = this.gameboard.getBoard();

		return this.winningCombinations.find((combination) =>
			combination.every((index) => board[index] === mark),
		) ?? null;
	}

	playRound(index) {
		if (!this.gameActive) {
			return { status: "inactive" };
		}

		if (!this.gameboard.placeMark(index, this.currentPlayer.mark)) {
			return { status: "invalid", player: this.currentPlayer };
		}

		const winningCombination = this.hasWinner(this.currentPlayer.mark);

		if (winningCombination) {
			this.gameActive = false;
			this.scores[this.currentPlayer.mark] += 1;
			return {
				status: "winner",
				player: this.currentPlayer,
				winningCombination,
			};
		}

		if (this.gameboard.getBoard().every((cell) => cell !== "")) {
			this.gameActive = false;
			return { status: "tie" };
		}

		this.currentPlayer = this.currentPlayer === this.players[0]
			? this.players[1]
			: this.players[0];
		return { status: "continue", player: this.currentPlayer };
	}

	getScores() {
		return { ...this.scores };
	}

	restartGame() {
		if (this.players.length === 0) {
			return null;
		}

		this.currentPlayer = this.players[0];
		this.gameActive = true;
		this.gameboard.reset();
		return this.currentPlayer;
	}
}

class DisplayController {
	constructor(gameboard, gameController) {
		this.gameboard = gameboard;
		this.gameController = gameController;
		this.playerForm = document.querySelector("#playerForm");
		this.playerOneNameInput = document.querySelector("#playerOneName");
		this.playerTwoNameInput = document.querySelector("#playerTwoName");
		this.gameStatus = document.querySelector("#gameStatus");
		this.playerOneCard = document.querySelector("#playerOneCard");
		this.playerTwoCard = document.querySelector("#playerTwoCard");
		this.playerOneScore = document.querySelector("#playerOneScore");
		this.playerTwoScore = document.querySelector("#playerTwoScore");
		this.boardElement = document.querySelector("#board");
		this.cells = document.querySelectorAll(".cell");
		this.resetButton = document.querySelector("#resetButton");

		this.bindEvents();
		this.renderBoard();
		this.renderScores();
		this.setBoardEnabled(false);
	}

	renderBoard() {
		const board = this.gameboard.getBoard();

		this.cells.forEach((cell, index) => {
			cell.textContent = board[index];
			cell.classList.remove("cell--x", "cell--o", "cell--winning");

			if (board[index] === "X") {
				cell.classList.add("cell--x");
			}

			if (board[index] === "O") {
				cell.classList.add("cell--o");
			}
		});
	}

	highlightWinningCells(winningCombination) {
		winningCombination.forEach((index) => {
			this.cells[index].classList.add("cell--winning");
		});
	}

	renderScores() {
		const scores = this.gameController.getScores();

		if (this.gameController.players.length === 0) {
			this.playerOneScore.textContent = "Waiting";
			this.playerTwoScore.textContent = "Waiting";
			return;
		}

		this.playerOneScore.textContent = `${this.gameController.players[0].name}: ${scores.X}`;
		this.playerTwoScore.textContent = `${this.gameController.players[1].name}: ${scores.O}`;
	}

	setActivePlayer(player) {
		this.playerOneCard.classList.toggle("player-card--active", player?.mark === "X");
		this.playerTwoCard.classList.toggle("player-card--active", player?.mark === "O");
	}

	setBoardEnabled(isEnabled) {
		this.cells.forEach((cell) => {
			cell.disabled = !isEnabled;
		});
	}

	updateStatus(result) {
		if (result.status === "winner") {
			this.gameStatus.textContent = `${result.player.name} wins!`;
			this.gameStatus.classList.add("game-status--result");
			this.resetButton.textContent = "Play Again";
			this.setActivePlayer(null);
			this.highlightWinningCells(result.winningCombination);
			this.renderScores();
			this.setBoardEnabled(false);
			return;
		}

		if (result.status === "tie") {
			this.gameStatus.textContent = "It's a tie!";
			this.gameStatus.classList.add("game-status--result");
			this.gameStatus.classList.add("game-status--draw");
			this.resetButton.textContent = "Play Again";
			this.setActivePlayer(null);
			this.setBoardEnabled(false);
			return;
		}

		if (result.status === "continue") {
			this.gameStatus.textContent = `${result.player.name}'s turn`;
			this.setActivePlayer(result.player);
		}
	}

	bindEvents() {
		this.playerForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const currentPlayer = this.gameController.startGame(
				this.playerOneNameInput.value.trim(),
				this.playerTwoNameInput.value.trim(),
			);

			this.renderBoard();
			this.renderScores();
			this.setBoardEnabled(true);
			this.gameStatus.classList.remove("game-status--result");
			this.gameStatus.classList.remove("game-status--draw");
			this.resetButton.textContent = "Restart Game";
			this.setActivePlayer(currentPlayer);
			this.gameStatus.textContent = `${currentPlayer.name}'s turn`;
		});

		this.boardElement.addEventListener("click", (event) => {
			const clickedCell = event.target.closest(".cell");

			if (!clickedCell) {
				return;
			}

			const result = this.gameController.playRound(
				Number(clickedCell.dataset.index),
			);
			this.renderBoard();
			this.updateStatus(result);
		});

		this.resetButton.addEventListener("click", () => {
			const currentPlayer = this.gameController.restartGame();

			if (!currentPlayer) {
				this.gameStatus.textContent = "Enter player names to start.";
				return;
			}

			this.renderBoard();
			this.renderScores();
			this.setBoardEnabled(true);
			this.gameStatus.classList.remove("game-status--result");
			this.gameStatus.classList.remove("game-status--draw");
			this.resetButton.textContent = "Restart Game";
			this.setActivePlayer(currentPlayer);
			this.gameStatus.textContent = `${currentPlayer.name}'s turn`;
		});
	}
}

const gameboard = new Gameboard();
const gameController = new GameController(gameboard);
new DisplayController(gameboard, gameController);
