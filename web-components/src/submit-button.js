export default (() => {
	const SELECTOR = 'jpe-submit-button';

	if (!!customElements.get(SELECTOR)) {
		return;
	}

	class el extends HTMLElement {
		constructor() {
			super()
			this.attachShadow({ mode: 'open' })
			this.shadowRoot.innerHTML = `<style>:host{display:block;}</style>`
			
			this.output = document.createElement('button');
			this.output.setAttribute('type', 'submit');
			this.output.addEventListener('click', () => {
				const form = this.closest('form');

				if (!form.reportValidity()) {
					return;
				}

				this.output.setAttribute('disabled', 'true');
	
				const data = new FormData(form);
				const typeMap = {
					string: 'stringValue',
					number: 'doubleValue'
				};
				const fields = {
					createdOn: {
						integerValue: Date.now().toString()
					}
				};
	
				data.forEach((value, key) => {
					fields[key] = {
						[typeMap[typeof value]]: value
					};
				});
	
				fetch(
					`https://firestore.googleapis.com/v1/projects/jaspero-jms/databases/(default)/documents/inquiries`,
					{
						method: 'POST',
						body: JSON.stringify({fields})
					}
				)
					.finally(() => 
						this.output.removeAttribute('disabled')
					);
			});
			
			this.shadowRoot.appendChild(this.output);
		}

		static get observedAttributes() {
			return ['label'];
		}

		connectedCallback() {
			this.output.innerText = this.getAttribute('label');
		}

		attributeChangedCallback() {
			this.connectedCallback();
		}
	}

	customElements.define(SELECTOR, el);
})()