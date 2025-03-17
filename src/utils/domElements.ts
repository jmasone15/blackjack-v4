import JSConfetti from 'js-confetti';

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
	resultModal = document.getElementById('result-modal') as HTMLDivElement;
	roundResultsDiv = document.getElementById('round-results') as HTMLDivElement;
	resultHeader = document.getElementById('result-header') as HTMLHeadingElement;
	totalBetSpan = document.getElementById('initial-bet') as HTMLSpanElement;
	closeModalBtn = document.getElementById('close-modal') as HTMLButtonElement;
	confetti = new JSConfetti() as JSConfetti;

	constructor() {
		const betBtnNodeList: NodeList = document.querySelectorAll('.bet-btn');
		this.betButtons = Array.from(
			betBtnNodeList,
			(node: Node) => node as HTMLButtonElement
		);

		this.closeModalBtn.addEventListener('click', (e: Event) => {
			this.hideElement(this.resultModal);
			return;
		});

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
