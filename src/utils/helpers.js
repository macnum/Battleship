import Ship from '../classes/Ship.js';

export function getShips() {
	const carrier = new Ship(5, 'carrier');
	const battleship = new Ship(4, 'battleship');
	const cruiser = new Ship(3, 'cruiser');
	const submarine = new Ship(3, 'submarine');
	const destroyer = new Ship(2, 'destroyer');
	return [carrier, battleship, cruiser, submarine, destroyer];
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
		while (!shipPlaced) {
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
