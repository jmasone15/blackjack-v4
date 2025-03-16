// This file holds all DOM references within TypeScript. Keeps the main files cleaner, other files will simply reference.
// Does not hold all possible event listeners. Only the ones that do not rely on game variables to run.

class DOMElements {
	startBtn = document.getElementById('start-btn') as HTMLButtonElement;
	pregameDiv = document.getElementById('pregame-section') as HTMLDivElement;
	dealerDiv = document.getElementById('dealer-section') as HTMLDivElement;
	playerDiv = document.getElementById('player-section') as HTMLDivElement;
	playerHandsDiv = document.getElementById('player-hands') as HTMLDivElement;
	buttonsDiv = document.getElementById('buttons') as HTMLDivElement;
	mainMenuBtn = document.getElementById('main-menu') as HTMLButtonElement;
	nextRoundBtn = document.getElementById('next-round') as HTMLButtonElement;
	totalMoneySpan = document.getElementById('total-money') as HTMLSpanElement;
	currentBetSpan = document.getElementById('current-bet') as HTMLSpanElement;
	betButtons: HTMLButtonElement[];

	constructor() {
		const betBtnNodeList: NodeList = document.querySelectorAll('.bet-btn');
		this.betButtons = Array.from(
			betBtnNodeList,
			(node: Node) => node as HTMLButtonElement
		);

		console.log('DOM Elements Class ready');
	}

	showElement(element: HTMLElement, classText: string = ''): void {
		element.setAttribute('class', classText);
		return;
	}

	hideElement(element: HTMLElement): void {
		element.setAttribute('class', 'd-none');
		return;
	}
}

const domElements = new DOMElements();
export default domElements;
