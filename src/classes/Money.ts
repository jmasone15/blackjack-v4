import domElements from '../utils/domElements';

const { totalMoneySpan, currentBetSpan, betButtons, showElement } = domElements;

export default class Money {
	total: number;
	currentBet: number;
	memoryKey: string;

	constructor() {
		this.memoryKey = 'blackjack-money';

		// Get from Memory or Set Default to Memory
		const storageString = localStorage.getItem(this.memoryKey);
		if (storageString) {
			const { total, currentBet } = JSON.parse(storageString);
			this.total = total;
			this.currentBet = currentBet;
		} else {
			this.total = 1000;
			this.currentBet = 10;
			this.memorySet();
		}

		// Set the current active Bet Button
		let activeBtn;
		betButtons.forEach((btn: HTMLButtonElement) => {
			const buttonValue = btn.getAttribute('data-value');
			if (buttonValue && parseInt(buttonValue) == this.currentBet) {
				activeBtn = btn;
			}
		});

		this.updateDOM(activeBtn);

		// Event Listeners
		betButtons.forEach((btn: HTMLButtonElement) => {
			btn.addEventListener('click', (e: Event) => {
				e.preventDefault();

				// Get Bet Amount from Button Properties
				const buttonValue = btn.getAttribute('data-value');
				if (!buttonValue) {
					return;
				}

				this.currentBet = parseInt(buttonValue);
				this.memorySet();
				this.updateDOM(btn);

				return;
			});
		});

		console.log('Money Class ready');
	}

	get currentBetText(): string {
		return `$${this.currentBet}`;
	}

	enoughMoneyCheck(multiply: number = 1): boolean {
		return this.currentBet * multiply <= this.total;
	}

	updateDOM(buttonToUpdate?: HTMLButtonElement) {
		totalMoneySpan.innerText = `$${this.total}`;
		currentBetSpan.innerText = this.currentBetText;

		if (buttonToUpdate) {
			// Reset all other buttons and set button clicked to active
			betButtons.forEach((btn: HTMLButtonElement) => {
				showElement(btn, 'button bet-btn');
			});
			showElement(buttonToUpdate, 'button bet-btn bet-btn-active');
		}
	}

	win() {
		this.total += this.currentBet * 2;
		this.memorySet();
		return this.updateDOM();
	}

	lose(multiply: number = 1) {
		this.total -= this.currentBet * multiply;
		this.memorySet();
		return this.updateDOM();
	}

	push() {
		this.total += this.currentBet;
		this.memorySet();
		return this.updateDOM();
	}

	memorySet() {
		const storageString: string = JSON.stringify({
			total: this.total,
			currentBet: this.currentBet
		});
		localStorage.setItem(this.memoryKey, storageString);
	}
}
