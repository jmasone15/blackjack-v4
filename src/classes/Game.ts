import domElements from '../utils/domElements';
import delay from '../utils/delay';
import Card from '../classes/Card';
import Hand from './Hand';

// DOM Elements
const {
	showElement,
	hideElement,
	startBtn,
	pregameDiv,
	dealerDiv,
	playerDiv,
	buttonsDiv
} = domElements;

export default class Game {
	// Deck Variables
	deckCount: number = 1;
	suits: string[] = ['♥', '♦', '♣', '♠'];
	cardValues: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	private currentDeck: Card[] = [];
	private currentDeckIdx: number = 0;

	// Hand Variables
	dealerHand: Hand | undefined;
	playerHands: Hand[] = [];
	playerHandCurrentIdx: number = 0;

	constructor() {
		// Create & Shuffle Deck
		this.createDeck();

		// Event Listeners
		startBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			return this.startRound();
		});

		console.log('Game Class ready');
	}

	async startRound() {
		// Update DOM
		hideElement(pregameDiv);
		showElement(dealerDiv);
		showElement(playerDiv);
		showElement(buttonsDiv, 'buttons');

		// Create Hands
		this.dealerHand = new Hand(-1);
		this.playerHands.push(new Hand(this.playerHands.length + 1));
		this.playerHandCurrentIdx = 0;

		// Deal Initial Cards
		for (let i = 0; i < 4; i++) {
			await delay(500);
			this.deal(i % 2 !== 0, i == 3);
		}
	}

	createDeck() {
		// Generate Deck based on Game parameters.
		for (let i = 0; i < this.deckCount; i++) {
			this.suits.forEach((suit: string) => {
				this.cardValues.forEach((value: number) => {
					this.currentDeck.push(new Card(suit, value));
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

	deal(toDealer: boolean, isFaceDown: boolean) {
		// Temp Variables
		let targetHand: Hand;
		let targetCard = this.currentDeck[this.currentDeckIdx];

		// Determine which Hand to deal to
		if (toDealer && this.dealerHand !== undefined) {
			targetHand = this.dealerHand;
		} else {
			targetHand = this.playerHands[this.playerHandCurrentIdx];
		}

		// Set Card Properties and Deal
		targetCard.isFaceDown = isFaceDown;
		targetHand.deal(targetCard);

		// Increment Deck
		this.currentDeckIdx++;
	}
}
