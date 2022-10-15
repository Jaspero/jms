export default (() => {
	const SELECTOR = 'jpe-shop-search';

	if (!!customElements.get(SELECTOR)) {
		return;
	}

	class el extends HTMLElement {
		constructor() {
			super()
			this.attachShadow({ mode: 'open' });
			this.shadowRoot.innerHTML = `
				<style>
					:host {
						display: block;
					}
				</style>
			`;

			this.input = document.createElement('input');

			this.input.placeholder = 'Search';

			this.shadowRoot.appendChild(this.input);
		}

		static get observedAttributes() {
			return [];
		}
	}

	customElements.define(SELECTOR, el);
})()