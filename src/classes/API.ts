import toast from './Toast';
import domElements from '../utils/domElements';
import loading from './Loading';

const {
	submitLoginBtn,
	usernameInput,
	usernameError,
	loginModal,
	totalMoneySpan,
	showElement,
	hideElement
} = domElements;

class API {
	private url: string;
	private cookieName: string;
	username: string | null;
	money: number | null;

	constructor() {
		this.url = 'https://simple-api-isq7ga.fly.dev/blackjack';
		this.cookieName = 'blackjackUserId';
		this.username = null;
		this.money = null;

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
		const { _id, nickname, money }: any = jsonRes;

		this.cookie = _id;
		this.username = nickname;
		this.money = money;

		// Update DOM
		totalMoneySpan.textContent = `$${this.money}`;

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
				throw new Error('oops');
			}

			// Parse and set data from API
			const data: any = await res.json();
			this.parseAPIResponse(data);
		} catch (error) {
			toast.negativeToast('Something went wrong...');
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
				throw new Error('oops');
			}

			// Parse and set data from API
			const data: any = await res.json();
			this.parseAPIResponse(data);
		} catch (error) {
			toast.negativeToast('Something went wrong...');
			console.error(error);
		} finally {
			await loading.setLoading(false);
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
				throw new Error('oops');
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
				this.money = money;
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
}

const api = new API();
export default api;
