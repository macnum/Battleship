import { dom, state } from '../index.js';
import { getShips } from '../utils/helpers.js';
import {
	renderPreview,
	renderBoard,
	renderGameUI,
	renderTurn,
	showPopup,
	renderPassScreen,
	hidePopup,
	applyShipOrientation,
} from './GameView.js';

export function toggleShipSelection(shipName) {
	if (state.selectedShipName === shipName) {
		clearShipSelection();
		return;
	}
	state.selectedShipName = shipName;
	document.querySelectorAll('.ship-container').forEach((el) => {
		el.classList.toggle('selected', el.id === shipName);
	});
}
export function clearShipSelection() {
	state.selectedShipName = null;
	clearDraggedShip();
	document
		.querySelectorAll('.ship-container.selected')
		.forEach((el) => el.classList.remove('selected'));
}

export function handleDragStart(ev, shipName) {
	state.draggedShip = getShips().find((ship) => ship.name === shipName);
	ev.dataTransfer.setData('shipName', shipName);
}
export function clearDraggedShip() {
	state.draggedShip = null;
	state.hoverPosition = null;
	state.previewCoords = [];
}

export function handleDragOver(ev) {
	ev.preventDefault();
	const row = Number(ev.currentTarget.dataset.row);
	const col = Number(ev.currentTarget.dataset.col);
	state.hoverPosition = [row, col];
	state.previewCoords = getPreviewCoords(row, col);
	renderPreview(state.previewCoords);
}

export function handlePlacementCellHover(ev) {
	if (!state.selectedShipName) return;
	const row = Number(ev.currentTarget.dataset.row);
	const col = Number(ev.currentTarget.dataset.col);
	state.hoverPosition = [row, col];
	state.previewCoords = getPreviewCoords(row, col);
	renderPreview(state.previewCoords);
}

export function handlePlacementCellClick(ev) {
	if (!state.selectedShipName) return;
	const row = Number(ev.currentTarget.dataset.row);
	const col = Number(ev.currentTarget.dataset.col);
	placeShipAt(state.selectedShipName, getPreviewCoords(row, col));
}

export function getPreviewCoords(row, col) {
	const ship =
		state.draggedShip ||
		(state.selectedShipName &&
			getShips().find((s) => s.name === state.selectedShipName));
	if (!ship) return [];
	const coords = [];
	for (let i = 0; i < ship.length; i++) {
		coords.push(
			state.shipDirection === 'horizontal'
				? [row, col + i]
				: [row + i, col],
		);
	}
	return coords;
}

export function isValidPlacement(coords) {
	if (!state.activePlacer || coords.length === 0) return false;
	const capacity = state.activePlacer.gameBoard.Capacity;
	const withinBounds = coords.every(
		([row, col]) =>
			row >= 0 && row < capacity && col >= 0 && col < capacity,
	);
	if (!withinBounds) return false;
	return coords.every(
		([row, col]) =>
			state.activePlacer.gameBoard.board[row][col].ship === null,
	);
}

export function handleDrop(ev) {
	ev.preventDefault();
	const shipName = ev.dataTransfer.getData('shipName');
	placeShipAt(shipName, state.previewCoords);
}

export function placeShipAt(shipName, coords) {
	const ship = getShips().find((s) => s.name === shipName);
	if (!ship || !isValidPlacement(coords)) return;

	const [row, col] = coords[0];
	try {
		state.activePlacer.gameBoard.placeShip(
			ship,
			[row, col],
			state.shipDirection,
		);
	} catch (error) {
		return;
	}

	document.getElementById(shipName)?.remove();
	clearShipSelection();
	renderBoard(state.activePlacer.gameBoard, dom.gridEl, false, true);

	if (state.activePlacer.gameBoard.ships.length === getShips().length) {
		const done = state.placementDoneCallback;
		state.placementDoneCallback = null;
		done?.();
	}
}

export function rotatePlacement() {
	state.shipDirection =
		state.shipDirection === 'horizontal' ? 'vertical' : 'horizontal';
	document.querySelectorAll('.ship-container').forEach((el) => {
		applyShipOrientation(el, Number(el.dataset.length));
	});
	if (state.hoverPosition && (state.draggedShip || state.selectedShipName)) {
		state.previewCoords = getPreviewCoords(
			state.hoverPosition[0],
			state.hoverPosition[1],
		);
		renderPreview(state.previewCoords);
	}
}

export function handleAttack(ev) {
	if (state.game.winner) return;
	const row = Number(ev.currentTarget.dataset.row);
	const col = Number(ev.currentTarget.dataset.col);

	let hit;
	try {
		hit = state.game.makeAttack([row, col]);
	} catch (error) {
		return;
	}
	const resultText = hit ? 'HIT! 🎯' : 'MISS! 💦';
	showPopup(resultText);

	if (state.game.winner) {
		renderGameUI(true);
		return;
	}

	if (state.gameMode === 'pvp') {
		const nextPlayerName = state.game.currentTurn.name;
		// Let the acting player see their own result before the "pass the
		// device" overlay (which sits above the popup) covers the screen.
		state.popupTimer = setTimeout(() => {
			hidePopup();
			renderPassScreen(nextPlayerName, () => renderGameUI(), resultText);
		}, 900);
	} else {
		renderGameUI();
		if (state.game.currentTurn === state.game.opponent) {
			renderTurn(true);
			state.computerTimer = setTimeout(runComputerTurn, 600);
		}
	}
}

export function runComputerTurn() {
	// GameController.makeAttack() detects a Computer's turn and delegates
	// to makeMove() internally, so no coords are passed here.
	let hit;
	try {
		hit = state.game.makeAttack();
	} catch (error) {
		return;
	}
	showPopup(hit ? 'Computer hit you! 💥' : 'Computer missed! 😅');
	renderGameUI(Boolean(state.game.winner));
}
