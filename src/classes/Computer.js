import Player from './Player.js';

export default class Computer extends Player {
	#capacity = 10; // currently a fixed vale but can be gotten from gameBoard
	generateRandomCoordinates() {
		return [this.#randomCoords(), this.#randomCoords()];
	}

	isCoordinateAttacked(opponent, coords) {
		const [row, col] = coords;

		return opponent.gameBoard.board[row][col].isAttacked;
	}
	#randomCoords() {
		return Math.floor(Math.random() * this.#capacity);
	}
	getValidAttackCoordinates(opponent) {
		let coords;
		do {
			coords = this.generateRandomCoordinates();
		} while (this.isCoordinateAttacked(opponent, coords));
		return coords;
	}
	makeMove(opponent) {
		return this.attack(opponent, this.getValidAttackCoordinates(opponent));
	}
}

const comp = new Computer();
const player1 = new Player();
const coords = comp.generateRandomCoordinates();
console.log(coords);
console.log(comp.isCoordinateAttacked(player1, coords));
