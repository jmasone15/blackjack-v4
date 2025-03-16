import domElements from '../utils/domElements';
import delay from '../utils/delay';
import Card from '../classes/Card';
import Hand from './Hand';
import ActionButton from './ActionButton';
import ActionButtons from './ActionButtons';
import removeDOMChildren from '../utils/removeDOMChildren';
import Money from './Money';

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

	// Money Variables
	private money: Money;

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

		// Create Money Class
		this.money = new Money();

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

	get currentHand(): Hand {
		return this.playerHands[this.playerHandCurrentIdx];
	}

	get nextHand(): Hand {
		return this.playerHands[this.playerHandCurrentIdx + 1];
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

		// Decrement Money
		this.money.lose();

		// Create Hands
		this.dealerHand = new Hand(-1);
		this.playerHands.push(new Hand(this.playerHands.length + 1));
		this.playerHandCurrentIdx = 0;

		// Deal Initial Cards
		for (let i = 0; i < 4; i++) {
			await this.deal(i % 2 !== 0, i == 3);
		}

		// Enable or Disable Split
		this.actionButtons.splitButton.permanentDisable =
			!this.currentHand.canHandSplit;

		// Pause after deal
		await delay(500);

		// Immediate Blackjack
		if (this.dealerHand.isTurnOver) {
			return this.endRound();
		} else if (this.currentHand.isTurnOver) {
			return this.dealerTurn();
		}

		// Activate User Hand
		this.currentHand.active = true;

		// Enable Action Buttons
		this.actionButtons.enableUserAction();

		return;
	}

	createDeck() {
		this.currentDeck = [];

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

	async deal(
		toDealer: boolean,
		isFaceDown: boolean,
		isDouble: boolean = false,
		targetHandOverride?: Hand
	) {
		await delay(250);

		// Temp Variables
		let targetHand: Hand;
		let targetCard = this.currentDeck[this.currentDeckIdx];

		// Determine which Hand to deal to
		if (targetHandOverride) {
			targetHand = targetHandOverride;
		} else if (toDealer && this.dealerHand !== undefined) {
			targetHand = this.dealerHand;
		} else {
			targetHand = this.currentHand;
		}

		// Set Card Properties and Deal
		targetCard.isFaceDown = isFaceDown;
		targetHand.deal(targetCard, isDouble);

		// Increment Deck
		this.currentDeckIdx++;

		// Reshuffle
		if (this.currentDeckIdx == this.currentDeck.length) {
			console.log('Reshuffling...');
			this.createDeck();
			this.currentDeckIdx = 0;
		}

		await delay(250);
	}

	hit = async () => {
		this.actionButtons.disableUserAction();

		await this.deal(false, false);

		if (this.currentHand.isTurnOver) {
			return this.endPlayerTurn();
		} else {
			// Can no longer double or split after hitting
			this.actionButtons.doubleButton.permanentDisable = true;
			this.actionButtons.splitButton.permanentDisable = true;
		}

		return this.actionButtons.enableUserAction();
	};

	stand = () => {
		this.actionButtons.disableUserAction();
		return this.endPlayerTurn();
	};

	split = async () => {
		this.actionButtons.disableUserAction();

		// Remove second card from original hand and update UI
		const splitCard = this.currentHand.removeCardForSplit();
		const newHand = new Hand(this.playerHands.length + 1);

		// Create new Hand and add splitCard
		this.playerHands.push(newHand);
		newHand.deal(splitCard, false);

		// Pause
		await delay(500);

		// Deal one more card to each hand
		await this.deal(false, false);
		await this.deal(false, false, false, newHand);

		// Checks to see if Split action should be disabled
		this.checkSplitAction();

		return this.actionButtons.enableUserAction();
	};

	double = async () => {
		this.actionButtons.disableUserAction();
		this.currentHand.double = true;

		await this.deal(false, true, true);
		await delay(500);

		return this.endPlayerTurn();
	};

	checkSplitAction() {
		if (this.playerHands.length > 3 || !this.currentHand.canHandSplit) {
			this.actionButtons.splitButton.permanentDisable = true;
			this.actionButtons.splitButton.disableButton();
		}

		return;
	}

	endPlayerTurn() {
		// If no more hands for the player, move on to dealer
		if (this.playerHands.length == this.playerHandCurrentIdx + 1) {
			this.dealerTurn();
			return;
		}

		// If next hand is already at 21, continue.
		if (this.nextHand.isTurnOver) {
			this.playerHandCurrentIdx++;
			this.endPlayerTurn();
			return;
		}

		// Update which hand is active on UI
		this.currentHand.active = false;
		this.playerHands[this.playerHandCurrentIdx + 1].active = true;
		this.playerHandCurrentIdx++;

		// Enable User Action
		this.actionButtons.permanentEnableActionButtons();
		this.actionButtons.enableUserAction();

		// Disable Split for new Hand if necessary
		this.checkSplitAction();

		return;
	}

	async dealerTurn() {
		// Deactivate user hand
		this.currentHand.active = false;

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
			hand.showHandAndTotal(true);

			const handWin = this.handWin(hand.total);
			const handText = `Hand ${hand.id}`;

			switch (handWin) {
				case 0:
					console.log(`${handText} - Dealer Win`);
					break;
				case 1:
					console.log(`${handText} - Player Win`);
					this.money.win();
					break;
				case 2:
					console.log(`${handText} - Push`);
					this.money.push();
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

		// Reset Action Buttons
		this.actionButtons.permanentEnableActionButtons();

		// Clear stale DOM Elements
		const dealerHandDiv = document.getElementById('dealer-hand') as HTMLElement;
		dealerHandDiv.remove();
		removeDOMChildren(playerHandsDiv);
	}
}
