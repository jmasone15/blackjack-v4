import domElements from '../utils/domElements';
import delay from '../utils/delay';
import Card from '../classes/Card';
import Hand from './Hand';
import ActionButton from './ActionButton';
import ActionButtons from './ActionButtons';
import removeDOMChildren from '../utils/removeDOMChildren';

// DOM Elements
const {
	showElement,
	hideElement,
	startBtn,
	pregameDiv,
	dealerDiv,
	playerDiv,
	playerHandsDiv,
	buttonsDiv,
	nextRoundBtn,
	mainMenuBtn
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
		mainMenuBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			// Clear stale data and elements
			this.reset();

			// Update DOM
			hideElement(dealerDiv);
			hideElement(playerDiv);
			hideElement(buttonsDiv);
			showElement(pregameDiv, 'pre-game');

			return;
		});
		nextRoundBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			// Clear stale data and elements
			this.reset();

			// Start next round
			return this.startRound();
		});

		console.log('Game Class ready');
	}

	async startRound() {
		// Disable Action Buttons
		this.actionButtons.disableUserAction();

		// Update DOM
		hideElement(pregameDiv);
		hideElement(mainMenuBtn);
		hideElement(nextRoundBtn);
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
		} else if (this.playerHands[this.playerHandCurrentIdx].isTurnOver) {
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

	split = () => {
		console.log('split');
	};

	double = () => {
		console.log('double');
	};

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

	handWin(playerHandTotal: number): number {
		// -1 - error
		// 0 - player hand loss
		// 1 - player hand win
		// 2 - player hand push

		// Null Check
		if (!this.dealerHand) {
			return -1;
		}

		const dealerTotal = this.dealerHand.total;

		// Player/Dealer - Bust
		if (playerHandTotal > 21) {
			return 0;
		} else if (dealerTotal > 21) {
			return 1;
		}

		// Player/Dealer - Push
		if (playerHandTotal == dealerTotal) {
			return 2;
		}

		// Dealer - No Bust
		if (dealerTotal > playerHandTotal) {
			return 0;
		} else {
			return 1;
		}
	}

	endRound() {
		// Dealer hand may not be shown if they get initial blackjack
		this.dealerHand?.showHandAndTotal(true);

		// Determine win scenario for each player hand
		this.playerHands.forEach((hand: Hand) => {
			const handWin = this.handWin(hand.total);
			const handText = `Hand ${hand.id}`;

			switch (handWin) {
				case 0:
					console.log(`${handText} - Dealer Win`);
					break;
				case 1:
					console.log(`${handText} - Player Win`);
					break;
				case 2:
					console.log(`${handText} - Push`);
					break;

				default:
					console.error(`${handText} - Something went wrong...`);
					break;
			}
		});

		// Switch from Action Buttons to End Round Buttons
		this.actionButtons.hideActionButtons();
		showElement(nextRoundBtn, 'button');
		showElement(mainMenuBtn, 'button');
	}

	reset() {
		// Clear stale Game data
		this.dealerHand = undefined;
		this.playerHands = [];

		// Clear stale DOM Elements
		const dealerHandDiv = document.getElementById('dealer-hand') as HTMLElement;
		dealerHandDiv.remove();
		removeDOMChildren(playerHandsDiv);
	}
}
