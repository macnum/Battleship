import { dom, state } from '../index.js';
import { getShips } from '../utils/helpers.js';
import {
	handleAttack,
	handleDragStart,
	handleDragOver,
	handleDrop,
	handlePlacementCellHover,
	handlePlacementCellClick,
	toggleShipSelection,
	isValidPlacement,
} from '../dom/events.js';

const CELL_SIZE = 25; // keep in sync with .grid-cell / .ship-block in style.css
const COLUMN_LABELS = 'ABCDEFGHIJ'.split('');

export function populateShipYard() {
	dom.shipYardEl.innerHTML = '';
	getShips().forEach((ship) => {
		const shipEl = document.createElement('div');
		shipEl.classList.add('ship-container');
		shipEl.id = ship.name;
		shipEl.draggable = true;
		shipEl.dataset.length = ship.length;
		shipEl.tabIndex = 0;
		shipEl.setAttribute('role', 'button');
		shipEl.setAttribute(
			'aria-label',
			`${ship.name}, ${ship.length} cells. Drag onto the board, or select then tap a cell.`,
		);

		for (let i = 0; i < ship.length; i++) {
			const block = document.createElement('div');
			block.classList.add('ship-block');
			shipEl.appendChild(block);
		}
		applyShipOrientation(shipEl, ship.length);

		shipEl.addEventListener('dragstart', (ev) =>
			handleDragStart(ev, ship.name),
		);
		shipEl.addEventListener('click', () => toggleShipSelection(ship.name));
		shipEl.addEventListener('keydown', (ev) => {
			if (ev.key === 'Enter' || ev.key === ' ') {
				ev.preventDefault();
				toggleShipSelection(ship.name);
			}
		});

		dom.shipYardEl.appendChild(shipEl);
	});
}

export function applyShipOrientation(shipEl, length) {
	// Toggle an orientation class so CSS can flip the block divider
	// (border-right only makes sense for horizontal ships; vertical ones
	// need border-bottom — see .ship-container.vertical in style.css).
	shipEl.classList.remove('horizontal', 'vertical');
	shipEl.classList.add(state.shipDirection);

	if (state.shipDirection === 'horizontal') {
		shipEl.style.width = `${length * CELL_SIZE}px`;
		shipEl.style.height = `${CELL_SIZE}px`;
		shipEl.style.flexDirection = 'row';
	} else {
		shipEl.style.width = `${CELL_SIZE}px`;
		shipEl.style.height = `${length * CELL_SIZE}px`;
		shipEl.style.flexDirection = 'column';
	}
}

export function renderPreview(coords) {
	dom.gridEl
		.querySelectorAll('.preview, .invalid-preview')
		.forEach((cell) => {
			cell.classList.remove('preview', 'invalid-preview');
		});
	if (coords.length === 0) return;
	const valid = isValidPlacement(coords);
	const capacity = state.activePlacer.gameBoard.Capacity;
	coords.forEach(([row, col]) => {
		if (row < 0 || row >= capacity || col < 0 || col >= capacity) return;
		const cell = dom.gridEl.querySelector(
			`.grid-cell[data-row="${row}"][data-col="${col}"]`,
		);
		if (cell) cell.classList.add(valid ? 'preview' : 'invalid-preview');
	});
}

export function renderGameUI(revealAll = false) {
	let mine, theirs, mineLabel, theirsLabel;

	if (state.gameMode === 'pvp') {
		mine = state.game.currentTurn;
		theirs =
			mine === state.game.player
				? state.game.opponent
				: state.game.player;
		mineLabel = `${mine.name} — Your Fleet`;
		theirsLabel = `${theirs.name}'s Waters`;
	} else {
		mine = state.game.player;
		theirs = state.game.opponent;
		mineLabel = 'Your Fleet';
		theirsLabel = 'Enemy Waters';
	}

	const targetClickable =
		!state.game.winner &&
		(state.gameMode === 'pvp' ||
			state.game.currentTurn === state.game.player);

	setLabel(dom.gridLabelEl, mineLabel);
	setLabel(dom.oppLabelEl, theirsLabel);
	dom.oppEl.classList.remove('board-pending');

	renderBoard(mine.gameBoard, dom.gridEl, false, true);
	renderBoard(theirs.gameBoard, dom.oppEl, targetClickable, revealAll);
	renderTurn();
}

export function renderTurn(thinking = false) {
	if (state.game.winner) {
		dom.turnDisplay.textContent =
			state.game.winner === state.game.player
				? 'You win!'
				: state.gameMode === 'pvp'
					? `${state.game.winner.name} wins!`
					: 'Computer wins.';
		return;
	}
	if (thinking) {
		dom.turnDisplay.textContent = 'Computer is thinking… 🤔';
		return;
	}
	dom.turnDisplay.textContent =
		state.gameMode === 'pvp'
			? `${state.game.currentTurn.name}'s turn`
			: state.game.currentTurn === state.game.player
				? 'Your turn'
				: "Computer's turn";
}

export function renderBoard(gameBoard, container, clickable, showShips) {
	container.innerHTML = '';
	container.classList.add('board-frame');

	const corner = document.createElement('div');
	corner.classList.add('board-corner');
	container.appendChild(corner);

	const colHeads = document.createElement('div');
	colHeads.classList.add('board-colheads');
	COLUMN_LABELS.forEach((letter) => {
		const head = document.createElement('span');
		head.textContent = letter;
		colHeads.appendChild(head);
	});
	container.appendChild(colHeads);

	const rowHeads = document.createElement('div');
	rowHeads.classList.add('board-rowheads');
	for (let i = 1; i <= gameBoard.Capacity; i++) {
		const head = document.createElement('span');
		head.textContent = i;
		rowHeads.appendChild(head);
	}
	container.appendChild(rowHeads);

	const grid = document.createElement('div');
	grid.classList.add('board-grid');

	const sunkShips = gameBoard.ships.filter((ship) => ship.isSunk());
	gameBoard.board.forEach((gameRow, rowIndex) => {
		const divRow = document.createElement('div');
		divRow.classList.add('grid-row');
		gameRow.forEach((cell, colIndex) => {
			const divCol = document.createElement('div');
			divCol.classList.add('grid-cell');
			divCol.dataset.row = rowIndex;
			divCol.dataset.col = colIndex;

			if (clickable && !cell.isAttacked) {
				divCol.addEventListener('click', handleAttack);
				divCol.classList.add('clickable');
			}
			if (state.phase === 'placing' && container === dom.gridEl) {
				divCol.addEventListener('dragover', handleDragOver);
				divCol.addEventListener('drop', handleDrop);
				divCol.addEventListener('mouseenter', handlePlacementCellHover);
				divCol.addEventListener('click', handlePlacementCellClick);
				divCol.classList.add('placeable');
			}
			if (cell.ship !== null && showShips) {
				divCol.classList.add('ship');
			}
			if (sunkShips.includes(cell.ship)) {
				divCol.classList.add('sunk');
			}
			if (cell.isAttacked) {
				divCol.classList.add(cell.ship !== null ? 'hit' : 'miss');
			}
			divRow.appendChild(divCol);
		});
		grid.appendChild(divRow);
	});
	container.appendChild(grid);
}

export function setLabel(el, text) {
	if (el) el.textContent = text;
}

export function showPopup(text) {
	clearTimeout(state.popupTimer);
	dom.popupEl.textContent = text;
	dom.popupEl.classList.add('show');
	state.popupTimer = setTimeout(hidePopup, 900);
}
export function hidePopup() {
	dom.popupEl.classList.remove('show');
}

export function renderPassScreen(playerName, callback, resultText = '') {
	removePassScreen();
	const overlay = document.createElement('div');
	overlay.classList.add('pass-screen');
	overlay.id = 'passScreen';
	overlay.innerHTML = `
		<div class="pass-screen-card">
			${resultText ? `<p class="pass-result">${resultText}</p>` : ''}
			<h2>Pass the device to ${playerName}</h2>
			<p class="pass-note">Don't look — ${playerName} is up next.</p>
			<button id="readyBtn" type="button">I'm ready</button>
		</div>
	`;
	document.body.appendChild(overlay);
	document.getElementById('readyBtn').addEventListener('click', () => {
		overlay.remove();
		callback();
	});
}
export function removePassScreen() {
	document.getElementById('passScreen')?.remove();
}
