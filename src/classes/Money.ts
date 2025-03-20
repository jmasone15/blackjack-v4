import domElements from '../utils/domElements';
import toast from './Toast';
import api from './API';

const { totalMoneySpan, currentBetSpan, betButtons, showElement } = domElements;

export default class Money {
	total: number;
	currentBet: number;
	memoryKey: string;

	constructor() {
		this.memoryKey = 'blackjack-money';
		this.total = -999;

		// Get from Memory or Set Default to Memory
		const storageString = localStorage.getItem(this.memoryKey);
		if (storageString) {
			const { currentBet } = JSON.parse(storageString);
			this.currentBet = currentBet;
		} else {
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

	set totalMoney(money: number) {
		this.total = money;
		this.updateDOM();
	}

	enoughMoneyCheck(multiply: number = 1, override: number = 0): boolean {
		if (override > 0) {
			return override <= this.total;
		} else {
			return this.currentBet * multiply <= this.total;
		}
	}

	updateDOM(buttonToUpdate?: HTMLButtonElement) {
		if (this.total !== -999) {
			totalMoneySpan.innerText = `$${this.total}`;
		}
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
		const totalWin = this.currentBet * 2;

		// Update Memory
		this.total += this.currentBet * 2;
		this.apiSet();

		// Update DOM
		toast.positiveToast(`+ $${totalWin}`);
		return this.updateDOM();
	}

	lose(multiply: number = 1, override: number = 0) {
		const totalLoss = override > 0 ? override : this.currentBet * multiply;

		// Update memory
		this.total -= totalLoss;
		this.apiSet();

		// Update DOM
		toast.negativeToast(`- $${totalLoss}`);
		return this.updateDOM();
	}

	push() {
		// Update Memory
		this.total += this.currentBet;
		this.apiSet();

		// Update DOM
		toast.positiveToast(`+ $${this.currentBet}`);
		return this.updateDOM();
	}

	memorySet() {
		const storageString: string = JSON.stringify({
			currentBet: this.currentBet
		});
		localStorage.setItem(this.memoryKey, storageString);
	}

	apiSet() {
		return api.update(this.total, true);
	}
}
