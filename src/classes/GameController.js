import Player from './Player.js';
import Computer from './Computer.js';

export default class GameController {
	#lastSunkShip = null;
	#placedShips = null;
	constructor() {
		this.#setupGame();
	}

	#setupGame() {
		this.player = new Player();
		this.opponent = new Computer();
		this.currentTurn = this.player;
		this.winner = undefined;
		this.#lastSunkShip = null;
		this.#placedShips = null;
	}
	resetGame() {
		this.#setupGame();
	}
	get lastSunkShip() {
		return this.#lastSunkShip;
	}

	placePlayerShipsRandomly() {
		this.player.placeShipsRandomly();
	}
	changeToPvP() {
		this.opponent = new Player();
	}
	makeAttack(coords) {
		if (this.winner) {
			throw new Error('Game is already over');
		}

		const opponent = this.#getOpponent();

		const attack = this.currentTurn.attack(opponent, coords);

		this.#lastSunkShip = opponent.gameBoard.lastSunkShip;

		if (this.isGameOver(opponent)) {
			this.winner = this.currentTurn;
			return this.winner;
		}

		this.#switchTurn();

		return attack;
	}
	computerTurn() {
		if (this.winner) {
			throw new Error('Game is already over');
		}
		if (this.currentTurn !== this.opponent) {
			throw new Error("It is not the computer's turn");
		}
		const opponent = this.#getOpponent();

		const attack = this.currentTurn.makeMove(opponent);

		this.#lastSunkShip = opponent.gameBoard.lastSunkShip;

		if (this.isGameOver(opponent)) {
			this.winner = this.currentTurn;
			return this.winner;
		}

		this.#switchTurn();

		return attack;
	}
	isGameOver(player) {
		return player.gameBoard.allShipsSunk();
	}
	#switchTurn() {
		this.currentTurn =
			this.currentTurn === this.player ? this.opponent : this.player;
	}
	#getOpponent() {
		return this.currentTurn === this.player ? this.opponent : this.player;
	}
}
