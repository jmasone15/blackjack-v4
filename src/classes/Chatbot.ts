import domElements from '../utils/domElements';
import toast from './Toast';
import Hand from './Hand';

const {
	chatBotIcon,
	adviceBtn,
	adviceDiv,
	adviceText,
	actionParagraph,
	actionText,
	chatBotSpinner,
	chatBotBtns,
	askBtn,
	showElement,
	hideElement
} = domElements;

class Chatbot {
	isLoading: boolean;

	constructor() {
		this.isLoading = false;

		// Event Listeners
		chatBotIcon.addEventListener('click', (e: Event) => {
			e.preventDefault();
			showElement(adviceDiv);
			hideElement(chatBotIcon);
		});

		adviceBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			showElement(chatBotIcon);
			hideElement(adviceDiv);
		});

		console.log('Chatbot Class ready.');
	}

	set loading(flag: boolean) {
		this.isLoading = flag;

		if (flag) {
			hideElement(adviceText);
			hideElement(chatBotBtns);
			showElement(chatBotSpinner);
		} else {
			hideElement(chatBotSpinner);
			hideElement(askBtn);
			showElement(adviceText);
			showElement(actionParagraph);
			showElement(chatBotBtns);
		}
	}

	async suggestion(
		dealerCardValue: string,
		playerHand: Hand,
		canPlayerSplit: boolean,
		canPlayerDouble: boolean
	) {
		try {
			this.loading = true;

			// Determine Action Array
			let actionArray = ['Hit', 'Stand'];
			if (canPlayerSplit) {
				actionArray.push('Split');
			}
			if (canPlayerDouble) {
				actionArray.push('Double');
			}

			// Call AI API
			const res: Response = await window.fetch(
				`https://simple-api-isq7ga.fly.dev/blackjack/help`,
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json;charset=UTF-8'
					},
					body: JSON.stringify({
						dealerCardValue,
						playerCardValues: playerHand.cardTextValues.join(', '),
						actionArray: actionArray.join(', ')
					})
				}
			);

			// Get data from AI
			const { response, reasoning } = await res.json();

			// Update DOM
			adviceText.textContent = reasoning;
			actionText.textContent = response;
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			console.error(error);
		} finally {
			this.loading = false;
		}
	}

	reset() {
		adviceText.textContent = '$10 to ask for advice!';
		actionText.textContent = '';

		hideElement(chatBotSpinner);
		hideElement(actionParagraph);
		hideElement(adviceDiv);
		showElement(chatBotIcon);
		showElement(chatBotBtns);
		showElement(askBtn);
	}
}

const chatbot = new Chatbot();
export default chatbot;
