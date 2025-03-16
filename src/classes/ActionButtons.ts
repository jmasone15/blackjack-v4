import ActionButton from './ActionButton';

export default class ActionButtons {
	hitButton: ActionButton;
	standButton: ActionButton;
	splitButton: ActionButton;
	doubleButton: ActionButton;

	constructor(
		hit: ActionButton,
		stand: ActionButton,
		split: ActionButton,
		double: ActionButton
	) {
		this.hitButton = hit;
		this.standButton = stand;
		this.splitButton = split;
		this.doubleButton = double;

		console.log('Action Buttons Class ready');
	}

	enableUserAction() {
		for (const button in this) {
			if (Object.prototype.hasOwnProperty.call(this, button)) {
				const actionButton = this[button] as ActionButton;
				if (!actionButton.permanentDisable) {
					actionButton.enableButton();
				}
			}
		}
	}

	disableUserAction() {
		for (const button in this) {
			if (Object.prototype.hasOwnProperty.call(this, button)) {
				const actionButton = this[button] as ActionButton;
				actionButton.disableButton();
			}
		}
	}

	hideActionButtons() {
		for (const button in this) {
			if (Object.prototype.hasOwnProperty.call(this, button)) {
				const actionButton = this[button] as ActionButton;
				actionButton.hideButton();
			}
		}
	}

	permanentEnableActionButtons() {
		for (const button in this) {
			if (Object.prototype.hasOwnProperty.call(this, button)) {
				const actionButton = this[button] as ActionButton;
				actionButton.permanentDisable = false;
			}
		}
	}
}
