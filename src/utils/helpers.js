import Ship from '../classes/Ship.js';

const SHIPS = [
	new Ship(5, 'carrier'),
	new Ship(4, 'battleship'),
	new Ship(3, 'cruiser'),
	new Ship(3, 'submarine'),
	new Ship(2, 'destroyer'),
];

export function getShips() {
	return SHIPS.map((s) => new Ship(s.length, s.name));
}

export function getRandomDirection() {
	const directions = ['horizontal', 'vertical'];
	const randomNumber = Math.floor(Math.random() * 2);
	return directions[randomNumber];
}

export function getRandomCoords(capacity) {
	return Math.floor(Math.random() * capacity);
}

export function randomlyPlaceShips(gameBoard) {
	const capacity = gameBoard.Capacity;
	let duplicateShipsArr = [...getShips()];

	while (duplicateShipsArr.length > 0) {
		const randomIndex = Math.floor(
			Math.random() * duplicateShipsArr.length,
		);
		const ship = duplicateShipsArr[randomIndex];
		let shipPlaced = false;
		// FIX: original loop had no upper bound — on a nearly-full board
		// a run of bad luck could spin indefinitely. Capped at 500 tries
		// (a 10x10 board with 5 ships never needs more than a handful).
		let attempts = 0;
		while (!shipPlaced && attempts < 500) {
			attempts++;
			try {
				gameBoard.placeShip(
					ship,
					[getRandomCoords(capacity), getRandomCoords(capacity)],
					getRandomDirection(),
				);
				shipPlaced = true;
			} catch (error) {
				// Try another position
			}
		}
		duplicateShipsArr.splice(randomIndex, 1);
	}
}
