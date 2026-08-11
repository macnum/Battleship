import GameController from '../classes/GameController.js';
import Player from '../classes/Player.js';
import Computer from '../classes/Computer.js';
import Ship from '../classes/Ship.js';

describe('GameController', () => {
	test('Has a Player and a Computer', () => {
		const game = new GameController();
		expect(game).toHaveProperty('player');
		expect(game).toHaveProperty('opponent');
		expect(game.player).toBeInstanceOf(Player);
		expect(game.opponent).toBeInstanceOf(Computer);
	});
	test('After changeToPvP(), the opponent is a Player', () => {
		const game = new GameController();
		const originalPlayer = game.player;
		game.changeToPvP();
		expect(game.opponent).toBeInstanceOf(Player);
		expect(game.player).toBe(originalPlayer);
		expect(game.opponent).not.toBeInstanceOf(Computer);
	});
	test('The player and opponent are different objects.', () => {
		const game = new GameController();
		expect(game.opponent).not.toBe(game.player);
	});
	test('When a new GameController is created, whose turn should it be', () => {
		const game = new GameController();
		expect(game.currentTurn).toBeInstanceOf(Player);
		expect(game.currentTurn).toBe(game.player);
	});
	test('When the current player attacks, the turn changes to the opponent', () => {
		const game = new GameController();
		expect(game.currentTurn).toBe(game.player);
		expect(game.currentTurn).not.toBe(game.opponent);
		game.makeAttack([0, 0]);
		expect(game.currentTurn).toBe(game.opponent);
		expect(game.currentTurn).not.toBe(game.player);
	});
	test('makeAttack returns true for a hit and false for a miss', () => {
		const game = new GameController();
		game.opponent.gameBoard.placeShip(new Ship(3), [0, 0], 'horizontal');
		expect(game.makeAttack([0, 1])).toBe(true);
		expect(game.makeAttack([2, 1])).toBe(false);
	});
	describe('isGameOver()', () => {
		test('Returns false when the player still has ships', () => {
			const game = new GameController();

			game.opponent.gameBoard.placeShip(
				new Ship(2),
				[0, 0],
				'horizontal',
			);

			game.opponent.gameBoard.receiveAttack([0, 0]);

			expect(game.isGameOver(game.opponent)).toBe(false);
		});

		test('Returns true when all of the player ships are sunk', () => {
			const game = new GameController();

			game.opponent.gameBoard.placeShip(
				new Ship(2),
				[0, 0],
				'horizontal',
			);

			game.opponent.gameBoard.receiveAttack([0, 0]);
			game.opponent.gameBoard.receiveAttack([0, 1]);

			expect(game.isGameOver(game.opponent)).toBe(true);
		});
		test('Game ends when all opponent ships are sunk', () => {
			const game = new GameController();

			game.opponent.gameBoard.placeShip(
				new Ship(1),
				[0, 0],
				'horizontal',
			);

			game.makeAttack([0, 0]);

			expect(game.isGameOver(game.opponent)).toBe(true);
		});
		test("When a player sinks all of the opponent's ships, that player becomes the winner.", () => {
			const game = new GameController();

			game.opponent.gameBoard.placeShip(
				new Ship(1),
				[0, 0],
				'horizontal',
			);
			game.makeAttack([0, 0]);
			expect(game.winner).toBe(game.player);
		});
		test('The opponent becomes the winner when they sink all player ships', () => {
			const game = new GameController();

			game.player.gameBoard.placeShip(new Ship(1), [0, 0], 'horizontal');
			game.makeAttack([0, 0]);
			game.makeAttack([0, 0]);
			expect(game.winner).toBe(game.opponent);
		});

		test('When someone wins, game does not continue', () => {
			const game = new GameController();

			game.player.gameBoard.placeShip(new Ship(1), [0, 0], 'horizontal');
			game.makeAttack([0, 0]);
			game.makeAttack([0, 0]);
			expect(game.winner).toBe(game.opponent);
			expect(() => game.makeAttack([1, 1])).toThrow(
				'Game is already over',
			);
		});
	});
});
