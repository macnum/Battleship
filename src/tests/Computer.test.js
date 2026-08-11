import Computer from '../classes/Computer.js';
import Player from '../classes/Player.js';
import GameBoard from '../classes/Gameboard.js';
import Ship from '../classes/Ship.js';

describe('Computer Class', () => {
	describe('generateRandomCoordinates()', () => {
		test('Generates coordinates within the board bounds', () => {
			const computer = new Computer();
			const coords = computer.generateRandomCoordinates();

			expect(typeof coords[0]).toBe('number');
			expect(typeof coords[1]).toBe('number');

			expect(coords[0]).toBeGreaterThanOrEqual(0);
			expect(coords[0]).toBeLessThan(10);

			expect(coords[1]).toBeGreaterThanOrEqual(0);
			expect(coords[1]).toBeLessThan(10);

			expect(coords.length).toBe(2);
		});
	});
	describe('getValidAttackCoordinates(opponent)', () => {
		test("Doesn't return coordinates that have already been attacked", () => {
			const computer = new Computer();
			const opponent = new Player();

			opponent.gameBoard.board[0][1].isAttacked = true;
			opponent.gameBoard.board[6][3].isAttacked = true;
			opponent.gameBoard.board[2][7].isAttacked = true;
			opponent.gameBoard.board[8][6].isAttacked = true;
			opponent.gameBoard.board[0][9].isAttacked = true;
			console.log(opponent.gameBoard.board);

			const coords = computer.getValidAttackCoordinates(opponent);

			expect(computer.isCoordinateAttacked(opponent, coords)).toBe(false);
		});
	});
	describe('makeMove()', () => {
		test('Attacks the opponent board', () => {
			const computer = new Computer();
			const opponent = new Player();
			opponent.gameBoard.placeShip(new Ship(3), [0, 0], 'horizontal');
			const spy = jest
				.spyOn(computer, 'getValidAttackCoordinates')
				.mockReturnValue([0, 0]);
			computer.makeMove(opponent);

			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledWith(opponent);
			expect(opponent.gameBoard.board[0][0].isAttacked).toBe(true);
		});
		test('Miss an attack on the opponent board ', () => {
			const computer = new Computer();
			const opponent = new Player();
			opponent.gameBoard.placeShip(new Ship(3), [3, 0], 'horizontal');
			const spy = jest
				.spyOn(computer, 'getValidAttackCoordinates')
				.mockReturnValue([0, 0]);
			expect(computer.makeMove(opponent)).toBe(false);
			expect(spy).toHaveBeenCalledWith(opponent);
			expect(opponent.gameBoard.board[0][0].isAttacked).toBe(true);
		});
	});
});
