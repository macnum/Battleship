import Player from './Player.js';
import Computer from './Computer.js';

export default class GameController {
	#lastSunkShip = null;
	constructor() {
		this.#setupGame();
	}

	#setupGame() {
		this.player = new Player('You');
		this.opponent = new Computer();
		this.currentTurn = this.player;
		this.winner = undefined;
		this.#lastSunkShip = null;
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
		this.opponent = new Player('Player 2');
	}
	makeAttack(coords) {
		if (this.winner) {
			throw new Error('Game is already over');
		}

		const opponent = this.#getOpponent();

		const attack =
			this.currentTurn instanceof Computer
				? this.currentTurn.makeMove(opponent)
				: this.currentTurn.attack(opponent, coords);

		this.#lastSunkShip = opponent.gameBoard.lastSunkShip;

		if (this.isGameOver(opponent)) {
			this.winner = this.currentTurn;
			return attack;
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
