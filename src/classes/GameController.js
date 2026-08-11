import Player from './Player.js';
import Computer from './Computer.js';

export default class GameController {
	winner;
	constructor() {
		this.player = new Player();
		this.opponent = new Computer();
		this.currentTurn = this.player;
	}
	changeToPvP() {
		this.opponent = new Player();
	}
	makeAttack(coords) {
		if (this.winner) {
			throw new Error("'Game is already over");
		}
		const opponent = this.#getOpponent();
		const attack = this.currentTurn.attack(opponent, coords);
		const gameOver = this.isGameOver(opponent);
		if (gameOver) {
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
