import Player from '../classes/Player.js';
import Ship from '../classes/Ship.js';
describe('Player Class', () => {
	test('Player has a GameBoard', () => {
		const player1 = new Player();

		expect(player1).toHaveProperty('gameBoard');
		expect(player1.gameBoard).toBeDefined();
	});
	test('Throws Error when opponent is not a Player', () => {
		const player1 = new Player();

		expect(() => player1.attack({}, [0, 0])).toThrow(
			'Opponent must be a Player',
		);
		expect(() => player1.attack([], [0, 0])).toThrow(
			'Opponent must be a Player',
		);
		expect(() => player1.attack(null, [0, 0])).toThrow(
			'Opponent must be a Player',
		);
		expect(() => player1.attack(undefined, [0, 0])).toThrow(
			'Opponent must be a Player',
		);
	});
	test('A successful attack returns true', () => {
		const player1 = new Player();

		const player2 = new Player();
		player2.gameBoard.placeShip(new Ship(3), [0, 0], 'horizontal');

		expect(player1.attack(player2, [0, 0])).toBe(true);
		expect(player1.attack(player2, [0, 1])).toBe(true);
		expect(player1.attack(player2, [0, 2])).toBe(true);
	});
	test('Missed attack return false', () => {
		const player1 = new Player();

		const player2 = new Player();
		player2.gameBoard.placeShip(new Ship(3), [5, 0], 'horizontal');

		expect(player1.attack(player2, [0, 0])).toBe(false);
		expect(player1.attack(player2, [0, 1])).toBe(false);
		expect(player1.attack(player2, [0, 2])).toBe(false);
	});
	test('Attacking the same cell throws an error', () => {
		const player1 = new Player();

		const player2 = new Player();
		player2.gameBoard.placeShip(new Ship(3), [0, 0], 'horizontal');
		player1.attack(player2, [0, 0]);

		expect(() => player1.attack(player2, [0, 0])).toThrow(
			'Coordinates has been attacked',
		);
	});
});
