import Player from './Player.js';
import { getRandomCoords } from '../utils/helpers.js';
export default class Computer extends Player {
	constructor() {
		super();
		this.placeShipsRandomly();
	}
	generateRandomCoordinates() {
		const capacity = this.gameBoard.Capacity;
		return [getRandomCoords(capacity), getRandomCoords(capacity)];
	}

	isCoordinateAttacked(opponent, coords) {
		const [row, col] = coords;

		return opponent.gameBoard.board[row][col].isAttacked;
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
