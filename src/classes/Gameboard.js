// import Ship from './Ship.js';
export default class GameBoard {
	#capacity;
	#missedAttack = [];
	#ships = new Set();
	#sunkShip = null;
	constructor(capacity = 10) {
		this.#capacity = capacity;

		this.board = Array.from({ length: this.#capacity }, () =>
			Array.from({ length: this.#capacity }, () => ({
				ship: null,
				isAttacked: false,
			})),
		);
	}
	get lastSunkShip() {
		return this.#sunkShip;
	}

	get ships() {
		return [...this.#ships];
	}
	get Capacity() {
		return this.#capacity;
	}

	placeShip(ship, startCoords, direction) {
		const shipCoordinates = this.#getShipCoordinates(
			ship,
			startCoords,
			direction,
		);

		const isWithinBounds = this.#validateShipCoords(shipCoordinates);

		if (!isWithinBounds) {
			throw new Error('coords entered are out of bounds');
		}
		const isBoardClear = this.#validateIsSpaceAvailable(shipCoordinates);
		if (!isBoardClear) {
			throw new Error('Ship exist on one or more of the cell');
		}

		shipCoordinates.forEach(([row, col]) => {
			this.board[row][col].ship = ship;
		});
		this.#ships.add(ship);
	}
	receiveAttack(attackCoords) {
		const [row, col] = attackCoords;
		this.#sunkShip = null;
		if (
			row < 0 ||
			row >= this.#capacity ||
			col < 0 ||
			col >= this.#capacity
		) {
			throw new Error('Coordinates are invalid');
		}
		const cell = this.board[row][col];
		if (cell.isAttacked) {
			throw new Error('Coordinates has been attacked');
		}
		cell.isAttacked = true;

		if (cell.ship !== null) {
			cell.ship.hit();
			if (cell.ship.isSunk()) {
				this.#sunkShip = cell.ship;
			}

			return true;
		} else {
			this.#missedAttack.push(attackCoords);
			return false;
		}
	}
	allShipsSunk() {
		if (this.#ships.size === 0) return false;
		return Array.from(this.#ships).every((ship) => ship.isSunk());
	}
	#getShipCoordinates(ship, startCoords, direction) {
		const shipCoords = [];
		let row;
		let column;

		for (let i = 0; i < ship.length; i++) {
			if (direction === 'horizontal') {
				row = startCoords[0];
				column = startCoords[1] + i;
			} else if (direction === 'vertical') {
				row = startCoords[0] + i;
				column = startCoords[1];
			} else {
				throw new Error(`Invalid Direction ${direction}`);
			}
			shipCoords.push([row, column]);
		}
		return shipCoords;
	}
	#validateShipCoords(shipCoordinates) {
		return shipCoordinates.every(([row, col]) => {
			return (
				row >= 0 &&
				row < this.#capacity &&
				col >= 0 &&
				col < this.#capacity
			);
		});
	}
	#validateIsSpaceAvailable(shipCoordinates) {
		return shipCoordinates.every(([row, col]) => {
			return this.board[row][col].ship === null;
		});
	}
	get missedAttacks() {
		return [...this.#missedAttack];
	}
}

// const bd = new GameBoard();

// console.log(bd.board[10][19]);
// console.log(!undefined);
