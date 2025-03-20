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
	private apiKey: string;
	private projectKey: string;
	private orgKey: string;

	constructor() {
		// Please don't steal my data im just too lazy to put in backend
		this.isLoading = false;
		this.apiKey =
			'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';
		this.projectKey = 'proj_onVobhDwWzoenY7UbyL5BF3e';
		this.orgKey = 'org-f5zgGinZ1WiI8r65ZaWJiwMM';

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

			console.log(actionArray);

			// Build query message and call AI API
			const message = `Hello, if I am playing blackjack and the dealer is showing a ${dealerCardValue}. My cards are [${playerHand.cardTextValues.join(
				', '
			)}]. Right now, I can can take the following actions: [${actionArray.join(
				', '
			)}]. What is the best statistical play?\nPlease format your response formatted as so:\n{"response": "ACTION", "reasoning": "..."}`;
			const res: Response = await window.fetch(
				'https://api.openai.com/v1/chat/completions',
				{
					method: 'POST',
					headers: {
						authorization: `Bearer ${this.apiKey}`,
						'Content-Type': 'application/json',
						'OpenAI-Organization': `${this.orgKey}`,
						'OpenAI-Project': `${this.projectKey}`
					},
					body: JSON.stringify({
						model: 'gpt-4o-mini',
						messages: [
							{
								role: 'user',
								content: message
							}
						]
					})
				}
			);

			// Get data from AI
			const data = await res.json();
			const { response, reasoning } = JSON.parse(
				data.choices[0].message.content
			);

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
