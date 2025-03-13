import domElements from '../utils/domElements';
// DOM Elements
const { showElement, hideElement, startBtn, pregameDiv, dealerDiv, playerDiv } =
	domElements;

export default class Game {
	deckCount: number = 2;
	suits: string[] = ['H', 'D', 'C', 'S'];
	cardValues: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	private currentDeck: string[] = [];

	constructor() {
		// Create & Shuffle Deck
		this.createDeck();

		// Event Listeners
		startBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			return this.startRound();
		});

		console.log('Game class ready');
	}

	startRound() {
		// Update DOM
		hideElement(pregameDiv);
		showElement(dealerDiv, '');
		showElement(playerDiv, '');
	}

	createDeck() {
		// Generate Deck based on Game parameters.
		for (let i = 0; i < this.deckCount; i++) {
			this.suits.forEach((suit: string) => {
				this.cardValues.forEach((value: number) => {
					// Create CARD Class
					this.currentDeck.push(`${suit}${value}`);
				});
			});
		}

		// Shuffle using Fisher-Yates Algorithim
		for (let i = 0; i < this.currentDeck.length; i++) {
			// Generate a random index from 0 to i.
			const randomIndex = Math.floor(Math.random() * (i + 1));

			// Swap elements at i and randomIndex.
			[this.currentDeck[i], this.currentDeck[randomIndex]] = [
				this.currentDeck[randomIndex],
				this.currentDeck[i]
			];
		}
	}
}
