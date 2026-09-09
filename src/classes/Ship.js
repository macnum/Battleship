export default class Ship {
	#numberOfHits = 0;
	#length;
	constructor(length, name = null) {
		if (!Number.isInteger(length) || length <= 0) {
			throw new Error('Ship length must be a positive integer.');
		}
		this.#length = length;
		this.name = name;
	}

	hit() {
		if (this.isSunk()) return false;
		this.#numberOfHits++;
		return true;
	}
	isSunk() {
		return this.#length === this.#numberOfHits;
	}
	get length() {
		return this.#length;
	}
	get numberOfHits() {
		return this.#numberOfHits;
	}
}
