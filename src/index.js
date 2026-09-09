import './style.css';
import GameController from './classes/GameController.js';
import {
	renderBoard,
	populateShipYard,
	renderGameUI,
	setLabel,
	hidePopup,
	removePassScreen,
	renderPassScreen,
} from '../src/dom/GameView.js';
import { clearShipSelection, rotatePlacement } from '../src/dom/events.js';

export const dom = {
	modeToggle: document.querySelector('.toggle-mode'),
	pvpBtn: document.querySelector('.pvp'),
	restartBtn: document.querySelector('.restart'),
	rotateBtn: document.querySelector('#rotateShip'),
	turnDisplay: document.querySelector('#turnDisplay'),
	gridEl: document.querySelector('#gridContainer'),
	oppEl: document.querySelector('#gridContainerOpponent'),
	gridLabelEl: document.querySelector('#gridContainerLabel'),
	oppLabelEl: document.querySelector('#gridContainerOpponentLabel'),
	shipYardEl: document.querySelector('#shipYard'),
	shipYardPanel: document.querySelector('.ships-container'),
	popupEl: document.querySelector('#popupOverlay'),
};

export const state = {
	game: new GameController(),
	manualPlacement: false, // ships placed by hand vs randomly
	gameMode: 'pvc', // 'pvc' | 'pvp'
	phase: 'battle', // 'placing' | 'battle'
	computerTimer: null,
	popupTimer: null,

	// placement-only state
	activePlacer: null,
	placementDoneCallback: null,
	shipDirection: 'horizontal',
	draggedShip: null,
	selectedShipName: null, // tap-to-place selection, for touch devices
	previewCoords: [],
	hoverPosition: null,
};

dom.modeToggle.addEventListener('change', (ev) => {
	state.manualPlacement = ev.target.checked;
	resetGame();
});
dom.pvpBtn.addEventListener('click', () => {
	state.gameMode = state.gameMode === 'pvp' ? 'pvc' : 'pvp';
	dom.pvpBtn.textContent =
		state.gameMode === 'pvp' ? 'Play vs Computer' : 'Enable PvP';
	resetGame();
});
dom.restartBtn.addEventListener('click', resetGame);
dom.rotateBtn.addEventListener('click', rotatePlacement);

resetGame();

export function resetGame() {
	clearTimeout(state.computerTimer);
	clearTimeout(state.popupTimer);
	removePassScreen();
	hidePopup();

	state.game.resetGame();
	if (state.gameMode === 'pvp') state.game.changeToPvP();

	state.shipDirection = 'horizontal';
	clearShipSelection();

	if (state.manualPlacement) {
		beginPlacementPhase(state.game.player, () => {
			if (state.gameMode === 'pvp') {
				renderPassScreen(state.game.opponent.name, () => {
					beginPlacementPhase(state.game.opponent, startBattle);
				});
			} else {
				state.game.opponent.placeShipsRandomly();
				startBattle();
			}
		});
	} else {
		state.game.player.placeShipsRandomly();

		state.game.opponent.placeShipsRandomly();
		startBattle();
	}
}

export function startBattle() {
	state.phase = 'battle';
	dom.shipYardPanel.classList.add('hidden');
	dom.rotateBtn.classList.add('hidden');
	renderGameUI();
}

export function beginPlacementPhase(player, onComplete) {
	state.phase = 'placing';
	state.activePlacer = player;
	state.placementDoneCallback = onComplete;
	state.shipDirection = 'horizontal';
	clearShipSelection();

	dom.shipYardPanel.classList.remove('hidden');
	dom.rotateBtn.classList.remove('hidden');

	setLabel(dom.gridLabelEl, `${player.name} — Deploy Fleet`);
	setLabel(dom.oppLabelEl, 'Enemy Waters');
	dom.oppEl.classList.remove('board-frame');
	dom.oppEl.classList.add('board-pending');
	dom.oppEl.textContent = 'Standing by…';

	renderBoard(player.gameBoard, dom.gridEl, false, true);
	populateShipYard();
	dom.turnDisplay.textContent = `${player.name}: place your ships`;
}
