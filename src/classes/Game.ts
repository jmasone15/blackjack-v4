import domElements from '../utils/domElements';
import delay from '../utils/delay';
import Card from '../classes/Card';
import Hand from './Hand';
import ActionButton from './ActionButton';
import ActionButtons from './ActionButtons';
import removeDOMChildren from '../utils/removeDOMChildren';
import Money from './Money';
import toast from './Toast';

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
	mainMenuBtn,
	resultModal,
	roundResultsDiv,
	totalBetSpan,
	resultHeader,
	handButtons,
	returnBetSpan,
	handCountSpan,
	confetti
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
	roundStartHandCount: number = 1;

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
			return this.returnToMain();
		});
		nextRoundBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			// Clear stale data and elements
			this.reset();

			// Start next round
			return this.startRound();
		});
		handButtons.forEach((btn: HTMLButtonElement) => {
			btn.addEventListener('click', (e: Event) => {
				e.preventDefault();

				// Get Hand Count from Button Properties
				const buttonValue = btn.getAttribute('data-value');
				if (!buttonValue) {
					return;
				}

				// Set Hand Count
				this.roundStartHandCount = parseInt(buttonValue);

				// Update DOM
				handCountSpan.innerText = `${this.roundStartHandCount}`;
				handButtons.forEach((button: HTMLButtonElement) => {
					if (button == btn) {
						showElement(button, 'button hand-btn hand-btn-active');
					} else {
						showElement(button, 'button hand-btn');
					}
				});
			});
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
		// Enough Money Check
		if (!this.money.enoughMoneyCheck(this.roundStartHandCount)) {
			// Replace with TOAST
			alert('Not enough money...');
			return this.returnToMain();
		}

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
		this.money.lose(this.roundStartHandCount);

		// Create Hands
		this.dealerHand = new Hand(-1);
		for (let i = 0; i < this.roundStartHandCount; i++) {
			this.playerHands.push(new Hand(i + 1));
		}
		this.playerHandCurrentIdx = 0;

		// Initial Deal
		await this.dealOneToAll(false);
		await this.dealOneToAll(true);

		// Can Hands Split or Double
		this.actionButtons.splitButton.permanentDisable =
			!this.currentHand.canHandSplit;

		// Pause after deal
		await delay(500);

		// Immediate Blackjack
		if (this.dealerHand.isTurnOver) {
			return this.endRound();
		} else if (this.currentHand.isTurnOver) {
			return this.endPlayerTurn();
		}

		// Activate User Hand
		this.currentHand.active = true;

		// Enable Action Buttons
		this.actionButtons.enableUserAction();
		this.checkSplitAction();

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
			toast.neutralToast('Reshuffling...');
			this.createDeck();
			this.currentDeckIdx = 0;
		}

		await delay(250);
	}

	async dealOneToAll(isSecondCard: boolean) {
		// Deal One Card to Each Hand
		for (let i = 0; i < this.playerHands.length; i++) {
			await this.deal(false, false, false, this.playerHands[i]);
		}

		// Deal One Card to Dealer Last
		await this.deal(true, isSecondCard);
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

		if (!this.money.enoughMoneyCheck()) {
			alert('Not enough money...');

			this.actionButtons.splitButton.permanentDisable = true;
			this.actionButtons.enableUserAction();

			return;
		}

		this.money.lose();

		// Remove second card from original hand and update UI
		const splitCard = this.currentHand.removeCardForSplit();
		const newHand = new Hand(this.playerHands.length + 1);

		// Create new Hand and add splitCard
		this.playerHands.push(newHand);
		newHand.deal(splitCard, false);

		// Set Split Hands flag
		this.currentHand.splitHand = true;
		newHand.splitHand = true;

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

		if (!this.money.enoughMoneyCheck()) {
			alert('Not enough money...');

			this.actionButtons.doubleButton.permanentDisable = true;
			this.actionButtons.enableUserAction();

			return;
		}

		this.currentHand.double = true;
		this.money.lose();

		await this.deal(false, true, true);
		await delay(500);

		return this.endPlayerTurn();
	};

	checkSplitAction() {
		if (
			this.playerHands.length > 3 ||
			!this.currentHand.canHandSplit ||
			!this.money.enoughMoneyCheck()
		) {
			this.actionButtons.splitButton.permanentDisable = true;
			this.actionButtons.splitButton.disableButton();
		}

		return;
	}

	endPlayerTurn() {
		this.currentHand.active = false;

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
		// 0 - Hand loss
		// 1 - Hand win
		// 2 - Hand push

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

	async endRound() {
		// Dealer hand may not be shown if they get initial blackjack
		this.dealerHand?.showHandAndTotal(true);

		// Calculate total bet with doubles and splits
		let totalBet: number = 0;
		let moneyRecieved: number = 0;

		// Determine win scenario for each player hand
		this.playerHands.forEach((hand: Hand) => {
			hand.showHandAndTotal(true);
			let handBet: number = 0;

			if (hand.doubledHand) {
				handBet += this.money.currentBet * 2;
			} else {
				handBet += this.money.currentBet;
			}

			// Determine hand result and create P tag
			const handWin: number = this.handWin(hand.total);
			const resultPEl: HTMLParagraphElement = document.createElement('p');
			const handText =
				this.playerHands.length == 1 ? '' : `${hand.handIdText}: `;

			// Populate result UI
			switch (handWin) {
				case 0:
					resultPEl.innerHTML = `${handText}<b><span class="loss">Loss - $${handBet}</span></b>`;
					break;
				case 1:
					resultPEl.innerHTML = `${handText}<b><span class="win">Win + $${
						handBet * 2
					}</span></b>`;
					moneyRecieved += handBet * 2;
					this.money.win();
					break;
				case 2:
					resultPEl.innerHTML = `${handText}<b><span class="push">Push + $${handBet}</span></b>`;
					moneyRecieved += handBet;
					this.money.push();
					break;

				default:
					resultPEl.innerHTML = `${handText}<b><span class="loss">Something went wrong...</span></b>`;
					break;
			}

			// Update DOM
			totalBet += handBet;
			roundResultsDiv.appendChild(resultPEl);
		});

		await delay(500);

		// Update DOM
		this.actionButtons.hideActionButtons();
		totalBetSpan.innerText = `$${totalBet}`;
		returnBetSpan.innerText = `$${moneyRecieved}`;

		showElement(nextRoundBtn, 'button');
		showElement(mainMenuBtn, 'button');
		showElement(resultModal, 'modal');

		// Determine Confetti
		if (moneyRecieved > totalBet) {
			showElement(resultHeader, 'win');
			await confetti.addConfetti({ confettiNumber: 100 });
			confetti.clearCanvas();
		} else if (moneyRecieved < totalBet) {
			showElement(resultHeader, 'loss');
		} else {
			showElement(resultHeader);
		}
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
		removeDOMChildren(roundResultsDiv);
		hideElement(resultModal);
	}

	returnToMain() {
		// Update DOM
		hideElement(dealerDiv);
		hideElement(playerDiv);
		hideElement(buttonsDiv);
		showElement(pregameDiv, 'pre-game');
	}
}
