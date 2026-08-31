import GameBoard from './Gameboard.js';
import { randomlyPlaceShips } from '../utils/helpers.js';

export default class Player {
	constructor() {
		this.gameBoard = new GameBoard();
	}
	attack(opponent, coords) {
		if (!(opponent instanceof Player)) {
			throw new Error('Opponent must be a Player');
		}
		return opponent.gameBoard.receiveAttack(coords);
	}
	placeShipsRandomly() {
		randomlyPlaceShips(this.gameBoard);
	}
}
