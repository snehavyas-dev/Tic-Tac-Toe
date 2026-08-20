const Gameboard = (() => {
	const board = ["", "", "", "", "", "", "", "", ""];

	const getBoard = () => [...board];

	const placeMark = (index, mark) => {
		if (board[index] !== "") {
			return false;
		}

		board[index] = mark;
		return true;
	};

	const reset = () => {
		board.fill("");
	};

	return {
		getBoard,
		placeMark,
		reset,
	};
})();

const Player = (name, mark) => ({
	name,
	mark,
});

const GameController = (() => {
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	let players = [];
	let currentPlayer;
	let gameActive = false;

	const startGame = (playerOneName, playerTwoName) => {
		players = [
			Player(playerOneName, "X"),
			Player(playerTwoName, "O"),
		];
		currentPlayer = players[0];
		gameActive = true;
		Gameboard.reset();

		return currentPlayer;
	};

	const hasWinner = (mark) => {
		const board = Gameboard.getBoard();

		return winningCombinations.some((combination) =>
			combination.every((index) => board[index] === mark),
		);
	};

	const playRound = (index) => {
		if (!gameActive) {
			return { status: "inactive" };
		}

		if (!Gameboard.placeMark(index, currentPlayer.mark)) {
			return { status: "invalid", player: currentPlayer };
		}

		if (hasWinner(currentPlayer.mark)) {
			gameActive = false;
			return { status: "winner", player: currentPlayer };
		}

		if (Gameboard.getBoard().every((cell) => cell !== "")) {
			gameActive = false;
			return { status: "tie" };
		}

		currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
		return { status: "continue", player: currentPlayer };
	};

	const restartGame = () => {
		if (players.length === 0) {
			return null;
		}

		currentPlayer = players[0];
		gameActive = true;
		Gameboard.reset();
		return currentPlayer;
	};

	return {
		startGame,
		playRound,
		restartGame,
	};
})();

const DisplayController = (() => {
	const playerForm = document.querySelector("#playerForm");
	const playerOneNameInput = document.querySelector("#playerOneName");
	const playerTwoNameInput = document.querySelector("#playerTwoName");
	const gameStatus = document.querySelector("#gameStatus");
	const boardElement = document.querySelector("#board");
	const cells = document.querySelectorAll(".cell");
	const resetButton = document.querySelector("#resetButton");

	const renderBoard = () => {
		const board = Gameboard.getBoard();

		cells.forEach((cell, index) => {
			cell.textContent = board[index];
		});
	};

	const setBoardEnabled = (isEnabled) => {
		cells.forEach((cell) => {
			cell.disabled = !isEnabled;
		});
	};

	const updateStatus = (result) => {
		if (result.status === "winner") {
			gameStatus.textContent = `${result.player.name} wins!`;
			setBoardEnabled(false);
			return;
		}

		if (result.status === "tie") {
			gameStatus.textContent = "It's a tie!";
			setBoardEnabled(false);
			return;
		}

		if (result.status === "continue") {
			gameStatus.textContent = `${result.player.name}'s turn`;
		}
	};

	playerForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const currentPlayer = GameController.startGame(
			playerOneNameInput.value.trim(),
			playerTwoNameInput.value.trim(),
		);

		renderBoard();
		setBoardEnabled(true);
		gameStatus.textContent = `${currentPlayer.name}'s turn`;
	});

	boardElement.addEventListener("click", (event) => {
		const clickedCell = event.target.closest(".cell");

		if (!clickedCell) {
			return;
		}

		const result = GameController.playRound(Number(clickedCell.dataset.index));
		renderBoard();
		updateStatus(result);
	});

	resetButton.addEventListener("click", () => {
		const currentPlayer = GameController.restartGame();

		if (!currentPlayer) {
			gameStatus.textContent = "Enter player names to start.";
			return;
		}

		renderBoard();
		setBoardEnabled(true);
		gameStatus.textContent = `${currentPlayer.name}'s turn`;
	});

	renderBoard();
	setBoardEnabled(false);
})();
