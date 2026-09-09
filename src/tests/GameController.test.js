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
		expect(game.opponent).not.toBeInstanceOf(Computer);
		expect(game.player).toBe(originalPlayer);
	});
	test('The player and opponent are different objects', () => {
		const game = new GameController();
		expect(game.player).not.toBe(game.opponent);
	});
	test('When a new GameController is created, the player goes first', () => {
		const game = new GameController();
		expect(game.currentTurn).toBe(game.player);
		expect(game.currentTurn).toBeInstanceOf(Player);
	});
	test('When the current player attacks, the turn changes to the opponent', () => {
		const game = new GameController();
		expect(game.currentTurn).toBe(game.player);
		game.makeAttack([0, 0]);
		expect(game.currentTurn).toBe(game.opponent);
		expect(game.currentTurn).not.toBe(game.player);
	});
	describe('makeAttack()', () => {
		test('Returns true when the player hits a ship', () => {
			const game = new GameController();
			game.opponent.gameBoard.placeShip(
				new Ship(3),
				[0, 0],
				'horizontal',
			);
			expect(game.makeAttack([0, 0])).toBe(true);
		});
		test('Returns false when the player misses', () => {
			const game = new GameController();
			game.opponent.gameBoard.placeShip(
				new Ship(3),
				[0, 0],
				'horizontal',
			);
			expect(game.makeAttack([5, 5])).toBe(false);
		});
		test('Computer uses makeMove when it is its turn', () => {
			const game = new GameController();
			const spy = jest
				.spyOn(game.opponent, 'makeMove')
				.mockReturnValue(false);
			game.makeAttack([0, 0]);
			expect(game.currentTurn).toBe(game.opponent);
			game.makeAttack();
			expect(spy).toHaveBeenCalledWith(game.player);
		});
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
		test('Returns true when all opponent ships are sunk', () => {
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
		test("When a player sinks all of the opponent's ships, that player becomes the winner", () => {
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
			game.makeAttack([5, 5]);
			const spy = jest
				.spyOn(game.opponent, 'makeMove')
				.mockImplementation(() => {
					game.player.gameBoard.receiveAttack([0, 0]);
					return true;
				});
			game.makeAttack();
			expect(spy).toHaveBeenCalledWith(game.player);
			expect(game.winner).toBe(game.opponent);
		});
		test('When someone wins, the game does not continue', () => {
			const game = new GameController();
			game.opponent.gameBoard.placeShip(
				new Ship(1),
				[0, 0],
				'horizontal',
			);
			game.makeAttack([0, 0]);
			expect(game.winner).toBe(game.player);
			expect(() => game.makeAttack([1, 1])).toThrow(
				'Game is already over',
			);
		});
	});
	describe('changeToPvP()', () => {
		test('PvP players take turns attacking', () => {
			const game = new GameController();
			game.changeToPvP();
			expect(game.currentTurn).toBe(game.player);
			game.makeAttack([0, 0]);
			expect(game.currentTurn).toBe(game.opponent);
			game.makeAttack([1, 1]);
			expect(game.currentTurn).toBe(game.player);
		});
		test('Both players can attack each other in PvP', () => {
			const game = new GameController();
			game.changeToPvP();
			game.opponent.gameBoard.placeShip(
				new Ship(2),
				[0, 0],
				'horizontal',
			);
			expect(game.makeAttack([0, 0])).toBe(true);
			game.player.gameBoard.placeShip(new Ship(2), [1, 1], 'horizontal');
			expect(game.makeAttack([1, 1])).toBe(true);
		});
		test('Changes the game to Player vs Player', () => {
			const game = new GameController();
			const originalPlayer = game.player;
			game.changeToPvP();
			expect(game.player).toBe(originalPlayer);
			expect(game.opponent).toBeInstanceOf(Player);
			expect(game.opponent).not.toBe(game.player);
		});
	});
});
