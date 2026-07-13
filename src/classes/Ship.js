export default class Ship {
	#numberOfHits = 0;
	#length;
	constructor(length) {
		if (!Number.isInteger(length) || length <= 0)
			throw new Error('Length number should be greater than 0');
		this.#length = length;
	}

	hit() {
		if (this.isSunk()) return;
		this.#numberOfHits++;
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
