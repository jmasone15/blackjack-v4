export default function removeDOMChildren(parent: HTMLElement) {
	while (parent.firstChild) {
		parent.removeChild(parent.lastChild as Node);
	}
}
