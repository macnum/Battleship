import Ship from '../classes/Ship';

describe('Ship constructor', () => {
	test('creates a ship with a valid length', () => {
		const ship = new Ship(5);

		expect(ship.length).toBe(5);
		expect(ship.numberOfHits).toBe(0);
	});

	test('throws if length is 0', () => {
		expect(() => new Ship(0)).toThrow();
	});

	test('throws if length is negative', () => {
		expect(() => new Ship(-5)).toThrow();
	});

	test('throws if length is a decimal', () => {
		expect(() => new Ship(2.5)).toThrow();
	});

	test('throws if length is a string', () => {
		expect(() => new Ship('3')).toThrow();
	});

	test('throws if length is an object', () => {
		expect(() => new Ship({})).toThrow();
	});

	test('throws if length is an array', () => {
		expect(() => new Ship([])).toThrow();
	});
});

describe('Ship.hit()', () => {
	test('increments the number of hits', () => {
		const ship = new Ship(3);

		ship.hit();

		expect(ship.numberOfHits).toBe(1);
	});

	test('can be called multiple times', () => {
		const ship = new Ship(3);

		ship.hit();
		ship.hit();

		expect(ship.numberOfHits).toBe(2);
	});

	test('does not increment after the ship is sunk', () => {
		const ship = new Ship(3);

		ship.hit();
		ship.hit();
		ship.hit();
		ship.hit();
		ship.hit();

		expect(ship.numberOfHits).toBe(3);
	});
});

describe('Ship.isSunk()', () => {
	test('returns false before enough hits', () => {
		const ship = new Ship(3);

		ship.hit();

		expect(ship.isSunk()).toBe(false);
	});

	test('returns true after exactly the required number of hits', () => {
		const ship = new Ship(3);

		ship.hit();
		ship.hit();
		ship.hit();

		expect(ship.isSunk()).toBe(true);
	});
});
