import GameBoard from './Gameboard.js';

export default class Player {
	constructor() {
		this.board = new GameBoard();
	}
	attack(opponent, coords) {
		if (!(opponent instanceof Player)) {
			throw new Error('Opponent must be a Player');
		}
		return opponent.board.receiveAttack(coords);
	}
}

const player1 = new Player();
console.log(player1 instanceof Player);
