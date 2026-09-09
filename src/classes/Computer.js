import Player from './Player.js';
import { getRandomCoords } from '../utils/helpers.js';

export default class Computer extends Player {
	#hitStack = [];
	constructor() {
		super('Computer');
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
		let coords;

		if (this.#hitStack.length > 0) {
			coords = this.#hitStack.pop();

			while (
				coords &&
				opponent.gameBoard.board[coords[0]][coords[1]].isAttacked
			) {
				coords = this.#hitStack.pop();
			}
		}

		if (!coords) {
			coords = this.getValidAttackCoordinates(opponent);
		}

		const hit = this.attack(opponent, coords);

		if (hit) {
			const [row, col] = coords;
			const neighbours = [
				[row - 1, col],
				[row + 1, col],
				[row, col - 1],
				[row, col + 1],
			];
			const capacity = opponent.gameBoard.Capacity;
			neighbours.forEach(([r, c]) => {
				if (
					r >= 0 &&
					r < capacity &&
					c >= 0 &&
					c < capacity &&
					!opponent.gameBoard.board[r][c].isAttacked
				) {
					this.#hitStack.push([r, c]);
				}
			});
		}

		if (opponent.gameBoard.lastSunkShip) {
			this.#hitStack = [];
		}

		return hit;
	}
}
