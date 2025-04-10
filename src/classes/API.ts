import toast from './Toast';
import domElements from '../utils/domElements';
import loading from './Loading';
import removeDOMChildren from '../utils/removeDOMChildren';

const {
	submitLoginBtn,
	usernameInput,
	usernameError,
	loginModal,
	totalMoneySpan,
	leaderBodyDiv,
	refreshBtn,
	brokeBtn,
	yesBrokeBtn,
	brokeSection,
	pregameDiv,
	yourTotalSpan,
	leaderBtn,
	leaderDiv,
	showElement,
	hideElement
} = domElements;

class API {
	private url: string;
	private cookieName: string;
	username: string | null;
	money: number | null;
	total: number | null;

	constructor() {
		this.url = 'https://simple-api-isq7ga.fly.dev/blackjack';
		this.cookieName = 'blackjackUserId';
		this.username = null;
		this.money = null;
		this.total = null;

		submitLoginBtn.addEventListener(
			'click',
			async (e: Event): Promise<void> => {
				e.preventDefault();

				// Hide existing validation message
				hideElement(usernameError);

				// Get text from input
				const username: string | null = usernameInput.value;

				// If passes login, sanitize and call login.
				if (!username || username.length > 20) {
					return showElement(usernameError, 'error-message');
				} else {
					// Trim whitespace
					let sanitized: string = username.trim();

					// Allow only alphanumeric characters (letters & numbers)
					sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');

					await this.login(sanitized);

					// Update DOM
					if (!this.money || !this.username) {
						usernameError.textContent =
							'Something went wrong. Go yell at Jordan.';
					} else {
						// Update DOM
						hideElement(loginModal);
					}
				}
			}
		);

		refreshBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			return this.populateLeaderboard(false);
		});

		yesBrokeBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			return this.moreMoney();
		});

		leaderBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			return this.populateLeaderboard(false, true);
		});

		console.log('API Class ready');
	}

	get cookie(): string | null {
		// The document.cookie API retrieves all cookies as a semi-colon deliminated string.
		const cookies = document.cookie.split('; ');
		for (const cookie of cookies) {
			// Each cookie has this format: "key1=value1"
			const [key, value] = cookie.split('=');
			if (key === this.cookieName) {
				// Decode function handles decoding cookies with special chars.
				return decodeURIComponent(value);
			}
		}

		// If cookie does not exist, return null
		return null;
	}

	set cookie(id: string) {
		// Set cookie to expire after one day
		const expires = new Date();
		expires.setDate(expires.getDate() + 1);

		// Save cookie through document.cookie API
		document.cookie = `${this.cookieName}=${encodeURIComponent(
			id
		)}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
	}

	deleteCookie(): void {
		console.log('test');
		document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	init(): Promise<void> | void {
		const cookie: string | null = this.cookie;

		if (cookie) {
			return this.getUser(cookie);
		} else {
			return showElement(loginModal, 'modal');
		}
	}

	parseAPIResponse(jsonRes: any) {
		// Parse values from API response
		const { _id, nickname, money, total }: any = jsonRes;

		this.cookie = _id;
		this.username = nickname;
		this.money = money;
		this.total = total;

		// Update DOM
		totalMoneySpan.textContent = `$${this.money}`;
		yourTotalSpan.textContent = `$${this.total}`;
		if (this.money !== null && this.money < 10) {
			showElement(brokeBtn, 'button');
		}

		return;
	}

	async login(username: string): Promise<void> {
		try {
			await loading.setLoading(true);
			const res: Response = await window.fetch(`${this.url}/login`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				},
				body: JSON.stringify({
					nickname: username
				})
			});

			if (!res.ok) {
				throw new Error('cannot login');
			}

			// Parse and set data from API
			const data: any = await res.json();
			this.parseAPIResponse(data);

			// Populate leaderboard
			await this.populateLeaderboard();
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			this.deleteCookie();
			console.error(error);
		} finally {
			await loading.setLoading(false);
			return;
		}
	}

	async getUser(id: string): Promise<void> {
		try {
			await loading.setLoading(true);
			const res: Response = await window.fetch(`${this.url}/user/${id}`);

			if (!res.ok) {
				throw new Error('not logged in');
			}

			// Parse and set data from API
			const data: any = await res.json();
			this.parseAPIResponse(data);

			// Populate leaderboard
			await this.populateLeaderboard();
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			this.deleteCookie();
			console.error(error);
		} finally {
			await loading.setLoading(false);
			return;
		}
	}

	async populateLeaderboard(
		skipLoading: boolean = true,
		fromEvent: boolean = false
	): Promise<void> {
		try {
			if (!skipLoading) {
				await loading.setLoading(true);
			}
			const res: Response = await window.fetch(`${this.url}/top-ten`);

			// Grab data from API
			if (!res.ok) {
				throw new Error('not logged in');
			}
			const data = await res.json();

			// Clear existing data
			removeDOMChildren(leaderBodyDiv);
			yourTotalSpan.textContent = `$${this.total}`;

			for (let i = 0; i < 10; i++) {
				// Create HTML Elements
				const tableRow = document.createElement('tr') as HTMLTableRowElement;
				const rankCell = document.createElement('td') as HTMLTableCellElement;
				const userCell = document.createElement('td') as HTMLTableCellElement;
				const totalCell = document.createElement('td') as HTMLTableCellElement;

				// Update elements with user/placeholder data.
				rankCell.textContent = `${i + 1}`;
				if (!data[i]) {
					userCell.textContent = 'N/A';
					totalCell.textContent = '$0';
				} else {
					userCell.textContent = data[i].nickname;
					totalCell.textContent = `$${data[i].total}`;

					// Check if user is on leaderboard
					if (this.username === data[i].nickname) {
						showElement(tableRow, 'highlight-user');
					}
				}

				tableRow.appendChild(rankCell);
				tableRow.appendChild(userCell);
				tableRow.appendChild(totalCell);
				leaderBodyDiv.appendChild(tableRow);
			}

			return;
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			console.error(error);
		} finally {
			await loading.setLoading(false);

			// Update DOM
			if (fromEvent) {
				hideElement(pregameDiv);
				showElement(leaderDiv, 'leaderboard-card');
			}
			return;
		}
	}

	async update(money: number, skipLoading: boolean = false): Promise<void> {
		try {
			if (!skipLoading) {
				await loading.setLoading(true, 'Loading...', 0);
			}
			const cookie = this.cookie;

			if (!this.cookie) {
				throw new Error('not logged in');
			}

			// Update in DB
			const res: Response = await window.fetch(`${this.url}/${cookie}`, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				},
				body: JSON.stringify({
					money
				})
			});

			// Set in API
			if (!res.ok) {
				throw new Error('oops');
			} else {
				const data = await res.json();
				this.money = data.money;
				this.total = data.total;

				yourTotalSpan.textContent = `$${this.total}`;
			}

			return;
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			console.error(error);
		} finally {
			await loading.setLoading(false);
			return;
		}
	}

	async moreMoney() {
		try {
			await loading.setLoading(true, "Jordan's fat pockets opening...", 2000);
			const res: Response = await window.fetch(
				`${this.url}/more-money/${this.cookie}`
			);

			if (!res.ok) {
				throw new Error('not logged in');
			}

			// Refill Money
			this.money = 1000;
			totalMoneySpan.textContent = `$${this.money}`;
			toast.positiveToast('+ $1000');

			// Populate leaderboard
			await this.populateLeaderboard();
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			this.deleteCookie();
			console.error(error);
		} finally {
			await loading.setLoading(false);

			// Update DOM
			hideElement(brokeSection);
			showElement(pregameDiv, 'pre-game');
			return;
		}
	}
}

const api = new API();
export default api;
