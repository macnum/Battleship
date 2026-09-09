import GameBoard from '../classes/Gameboard';
import Ship from '../classes/Ship';

describe('GameBoard.placeShip()', () => {
	describe('Successful Placement', () => {
		test('places a horizontal ship correctly', () => {
			const bd = new GameBoard();
			const horizontalShip = new Ship(3);
			bd.placeShip(horizontalShip, [0, 0], 'horizontal');
			expect(bd.board[0][0].ship).toBe(horizontalShip);
			expect(bd.board[0][1].ship).toBe(horizontalShip);
			expect(bd.board[0][2].ship).toBe(horizontalShip);
		});
		test('Places a vertical ship correctly', () => {
			const bd = new GameBoard();
			const verticalShip = new Ship(4);
			bd.placeShip(verticalShip, [1, 1], 'vertical');
			expect(bd.board[1][1].ship).toBe(verticalShip);
			expect(bd.board[2][1].ship).toBe(verticalShip);
			expect(bd.board[3][1].ship).toBe(verticalShip);
			expect(bd.board[4][1].ship).toBe(verticalShip);
		});
	});
	describe('Invalid placement', () => {
		test('Throws when the ship goes out bounds', () => {
			const bd = new GameBoard();
			const ship = new Ship(3);
			expect(() => {
				bd.placeShip(ship, [-1, 0], 'vertical');
			}).toThrow('coords entered are out of bounds');
			expect(() => {
				bd.placeShip(ship, [4, 99], 'horizontal');
			}).toThrow('coords entered are out of bounds');
			expect(() => {
				bd.placeShip(ship, [8, 8], 'horizontal');
			}).toThrow('coords entered are out of bounds');
		});
		test('Throws when the placement overlaps another ship.', () => {
			const bd = new GameBoard();
			const ship1 = new Ship(3);
			const ship2 = new Ship(3);
			bd.placeShip(ship1, [0, 0], 'horizontal');
			expect(() => {
				bd.placeShip(ship2, [0, 0], 'horizontal');
			}).toThrow('Ship exist on one or more of the cell');
			expect(() => {
				bd.placeShip(ship2, [0, 1], 'vertical');
			}).toThrow('Ship exist on one or more of the cell');
		});
	});
});
describe('GameBoard.receiveAttack()', () => {
	test('Throws am Error when coordinate are out of bounds', () => {
		const board = new GameBoard();
		const ship = new Ship(3);
		board.placeShip(ship, [0, 0], 'vertical');
		expect(() => {
			board.receiveAttack([-1, 3]);
		}).toThrow('Coordinates are invalid');
		expect(() => {
			board.receiveAttack([7, -1]);
		}).toThrow('Coordinates are invalid');
		expect(() => {
			board.receiveAttack([79, 26]);
		}).toThrow('Coordinates are invalid');
		expect(() => {
			board.receiveAttack([7, 67]);
		}).toThrow('Coordinates are invalid');
		expect(() => {
			board.receiveAttack([-5, 167]);
		}).toThrow('Coordinates are invalid');
	});
	test('Throws an error if there is duplicate attack on a cell', () => {
		const board = new GameBoard();
		const ship = new Ship(3);
		board.placeShip(ship, [1, 1], 'horizontal');
		board.receiveAttack([1, 1]);
		board.receiveAttack([1, 2]);
		expect(() => {
			board.receiveAttack([1, 1]);
		}).toThrow('Coordinates has been attacked');
		expect(() => {
			board.receiveAttack([1, 2]);
		}).toThrow('Coordinates has been attacked');
	});
	test('Returns true when a ship is hit', () => {
		const board = new GameBoard();
		const ship = new Ship(2);
		board.placeShip(ship, [0, 0], 'horizontal');
		expect(board.receiveAttack([0, 0])).toBe(true);
		expect(ship.numberOfHits).toBe(1);
		expect(board.board[0][0].isAttacked).toBe(true);
	});
	test('Returns false when attacking an empty cell', () => {
		const board = new GameBoard();
		expect(board.receiveAttack([5, 0])).toBe(false);
		expect(board.board[5][0].isAttacked).toBe(true);
	});
	test('Expects number of hits to increment by 1', () => {
		const board = new GameBoard();
		const ship = new Ship(2);
		board.placeShip(ship, [0, 0], 'horizontal');
		board.receiveAttack([0, 0]);
		expect(ship.numberOfHits).toBe(1);
		board.receiveAttack([0, 1]);
		expect(ship.numberOfHits).toBe(2);
	});
	test('Sinks the ship after all sections are hit', () => {
		const board = new GameBoard();
		const ship = new Ship(2);
		board.placeShip(ship, [0, 0], 'horizontal');
		board.receiveAttack([0, 0]);
		expect(ship.isSunk()).toBe(false);
		board.receiveAttack([0, 1]);
		expect(ship.isSunk()).toBe(true);
	});
});
describe('GameBoard.allShipSunk()', () => {
	test('Returns false when no ships have been placed', () => {
		const board = new GameBoard();
		expect(board.allShipsSunk()).toBe(false);
	});
	test('Returns false when no ship is sunk', () => {
		const board = new GameBoard();
		board.placeShip(new Ship(3), [0, 2], 'horizontal');
		expect(board.allShipsSunk()).toBe(false);
		board.placeShip(new Ship(3), [4, 2], 'vertical');
		expect(board.allShipsSunk()).toBe(false);
	});
	test('Returns false when a ship has been partially hit', () => {
		const board = new GameBoard();
		const ship1 = new Ship(2);
		const ship2 = new Ship(3);
		board.placeShip(ship1, [0, 0], 'horizontal');
		board.placeShip(ship2, [2, 2], 'vertical');
		board.receiveAttack([0, 1]);
		board.receiveAttack([0, 2]);
		expect(board.allShipsSunk()).toBe(false);
	});
	test('Returns true when every ship is sunk', () => {
		const board = new GameBoard();
		const ship1 = new Ship(2);
		const ship2 = new Ship(3);
		board.placeShip(ship1, [0, 0], 'horizontal');
		board.receiveAttack([0, 0]);
		board.receiveAttack([0, 1]);
		board.placeShip(ship2, [2, 2], 'vertical');
		board.receiveAttack([2, 2]);
		board.receiveAttack([3, 2]);
		board.receiveAttack([4, 2]);
		expect(board.allShipsSunk()).toBe(true);
	});
});
