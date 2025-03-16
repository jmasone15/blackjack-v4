import domElements from '../utils/domElements';
import delay from '../utils/delay';
import Card from '../classes/Card';
import Hand from './Hand';
import ActionButton from './ActionButton';

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
	hitButton: ActionButton;
	standButton: ActionButton;
	splitButton: ActionButton;
	doubleButton: ActionButton;
	actionButtonsArray: ActionButton[];

	constructor() {
		// Create & Shuffle Deck
		this.createDeck();

		// Create Action Buttons
		this.hitButton = new ActionButton('hit', this.hit);
		this.standButton = new ActionButton('stand', this.stand);
		this.splitButton = new ActionButton('split', this.split);
		this.doubleButton = new ActionButton('double', this.double);
		this.actionButtonsArray = [
			this.hitButton,
			this.standButton,
			this.splitButton,
			this.doubleButton
		];

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

		// Blackjack off Draw Check
		if (this.dealerHand.endTurnCheck()) {
			return this.endRound();
		}
		if (this.playerHands[this.playerHandCurrentIdx].endTurnCheck()) {
			return this.dealerTurn();
		}

		// Enable Action Buttons
		this.enableUserAction();

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

	enableUserAction() {
		for (const button of this.actionButtonsArray) {
			button.enableButton();
		}
	}

	disbaleUserAction() {
		for (const button of this.actionButtonsArray) {
			button.disableButton();
		}
	}

	hit = async () => {
		this.disbaleUserAction();

		await this.deal(false, false);

		if (this.playerHands[this.playerHandCurrentIdx].endTurnCheck()) {
			return this.dealerTurn();
		}

		return this.enableUserAction();
	};

	stand() {
		console.log('stand');
	}

	split() {
		console.log('split');
	}

	double() {
		console.log('double');
	}

	dealerTurn() {
		console.log('dealer turn');
	}

	endRound() {
		console.log('end round');
	}
}
