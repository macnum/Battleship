import GameBoard from './Gameboard.js';

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
}

const player1 = new Player();
const player2 = new Player();
console.log(player2.attack(player1, [0, 0]));
console.log(player2.gameBoard);
console.log(player1 instanceof Player);
