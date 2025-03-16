import domElements from '../utils/domElements';
import delay from '../utils/delay';
import Card from '../classes/Card';
import Hand from './Hand';
import ActionButton from './ActionButton';
import ActionButtons from './ActionButtons';

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
	private dealerHand: Hand | undefined;
	private playerHands: Hand[] = [];
	playerHandCurrentIdx: number = 0;

	// Action Buttons
	actionButtons: ActionButtons;

	constructor() {
		// Create & Shuffle Deck
		this.createDeck();

		// Create Action Buttons
		this.actionButtons = new ActionButtons(
			new ActionButton('hit', this.hit),
			new ActionButton('stand', this.stand),
			new ActionButton('split', this.split),
			new ActionButton('double', this.double)
		);

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
			await this.deal(i % 2 !== 0, i == 3);
		}

		// Pause after deal
		await delay(500);

		// Immediate Blackjack
		if (this.dealerHand.isTurnOver) {
			return this.endRound();
		}
		if (this.playerHands[this.playerHandCurrentIdx].isTurnOver) {
			return this.dealerTurn();
		}

		// Activate user Hand
		this.playerHands[this.playerHandCurrentIdx].active = true;

		// Enable Action Buttons
		this.actionButtons.enableUserAction();

		return;
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

	async deal(toDealer: boolean, isFaceDown: boolean) {
		await delay(250);

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

		await delay(250);
	}

	hit = async () => {
		this.actionButtons.disableUserAction();

		await this.deal(false, false);

		if (this.playerHands[this.playerHandCurrentIdx].isTurnOver) {
			return this.dealerTurn();
		}

		return this.actionButtons.enableUserAction();
	};

	stand = () => {
		this.actionButtons.disableUserAction();
		return this.dealerTurn();
	};

	split() {
		console.log('split');
	}

	double() {
		console.log('double');
	}

	async dealerTurn() {
		// Deactivate user hand
		this.playerHands[this.playerHandCurrentIdx].active = false;

		// Show flipped cards and total
		this.dealerHand?.showHandAndTotal();
		await delay(250);

		while (this.dealerHand?.shouldDealerHit) {
			await this.deal(true, false);
		}

		return this.endRound();
	}

	endRound() {
		this.dealerHand?.showHandAndTotal();

		console.log('end round');
	}
}
