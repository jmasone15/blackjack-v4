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
	handCountSpan = document.getElementById('hand-count') as HTMLSpanElement;
	resultModal = document.getElementById('result-modal') as HTMLDivElement;
	loginModal = document.getElementById('login-modal') as HTMLDivElement;
	roundResultsDiv = document.getElementById('round-results') as HTMLDivElement;
	resultHeader = document.getElementById('result-header') as HTMLHeadingElement;
	totalBetSpan = document.getElementById('initial-bet') as HTMLSpanElement;
	returnBetSpan = document.getElementById('return-bet') as HTMLSpanElement;
	closeModalBtn = document.getElementById('close-modal') as HTMLButtonElement;
	usernameInput = document.getElementById('username') as HTMLInputElement;
	usernameError = document.getElementById(
		'username-error'
	) as HTMLParagraphElement;
	submitLoginBtn = document.getElementById('submit-login') as HTMLButtonElement;
	betButtons: HTMLButtonElement[];
	handButtons: HTMLButtonElement[];
	confetti = new JSConfetti() as JSConfetti;

	constructor() {
		this.betButtons = this.convertNodeListToArray('.bet-btn');
		this.handButtons = this.convertNodeListToArray('.hand-btn');

		this.closeModalBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

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

	convertNodeListToArray(classText: string): HTMLButtonElement[] {
		const nodeList = document.querySelectorAll(classText);
		return Array.from(nodeList, (node: Node) => node as HTMLButtonElement);
	}
}

const domElements = new DOMElements();
export default domElements;
