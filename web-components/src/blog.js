export default (() => {
	const SELECTOR = 'jpe-blog';

	if (!!customElements.get(SELECTOR)) {
		return;
	}

	class el extends HTMLElement {
		constructor() {
			super()
			this.attachShadow({ mode: 'open' });
			this.shadowRoot.innerHTML = `
				<div id="posts"></div>
				<slot name="load-more"></slot>
			`;

			this.offset = 0;
			this.postsEl = this.shadowRoot.getElementById('posts');
		}

		connectedCallback() {
			this.loadMoreEl = this.querySelector('*[slot="load-more"]');

			if (!this.setAttibutes() && !this.called) {
				this.called = true;
				this.getData().catch(console.error);
			}

			if (this.loadMoreEl) {
				this.loadMoreEl.onclick = () =>
					this.getData().catch(console.error)
			}
		}

		static get observedAttributes() {
			return ['limit', 'orderby'];
		}

		setAttibutes() {

			const limit = this.getAttribute('limit');
			const orderby = this.getAttribute('orderBy');

			this.limit = parseInt(limit || '10', 10);
			this.orderBy = orderby || 'publishedOn';

			return limit || orderby;
		}

		async getData() {
			let res = await fetch(
				`https://firestore.googleapis.com/v1/projects/jaspero-jms/databases/(default)/documents:runQuery`,
				{
					method: 'POST',
					body: JSON.stringify({
						structuredQuery: {
							from: [{
								collectionId: 'posts'
							}],
							where: {
								fieldFilter: {
									field: {
                    fieldPath: 'active'
									},
                	op: 'EQUAL',
                	value: {
                    booleanValue: true,
                	}
								}
							},
							limit: this.limit + 1,
							offset: this.offset,
							orderBy: [{
								field: {
									fieldPath: 'publishedOn'
								},
								direction: 'DESCENDING'
							}]
						}
					})
				}
			);

			res = await res.json();

			if (res.some(it => it.error)) {
				throw new Error(
					res
						.filter(it => it.error)
						.map(it => it.error.message)
						.join('\n')
				);
			}

			res = res
				.filter(doc => doc.document);

			if (res.length !== (this.limit + 1) && this.loadMoreEl) {
				this.loadMoreEl.setAttribute('disabled', true);
			}

			this.cardTemplate = this.querySelector('#blog-card');

			this.offset += this.limit;

			res
				.slice(0, this.limit)
				.forEach(doc => this.createCard(doc.document.fields));
		}

		attributeChangedCallback() {
			this.setAttibutes();
			this.getData()
				.catch(console.error);
		}

		createCard(blog) {

			const item = {
				image: blog.featuredImage.stringValue,
				title: blog.title.stringValue,
				link: '/blog/' + id,
				publishedOn: new Date(
					parseInt(blog.publishedOn.integerValue, 10)
				).toLocaleDateString(),
				description: blog.meta?.mapValue?.fields?.description?.stringValue || ''
			};

			const el = this.cardTemplate.content.cloneNode(true);

			const titleEl = el.querySelector('[blog-card-title]');
			const imgEl = el.querySelector('[blog-card-img]');
			const publishedEl = el.querySelector('[blog-card-published]');
			const descriptionEl = el.querySelector('[blog-card-description]');
			const linkEl = el.querySelector('[blog-card-link]');

			if (titleEl && item.title) {
				titleEl.innerText = item.title;
			}

			if (imgEl && item.image) {
				imgEl.src = item.image;
			}

			if (publishedEl && item.publishedOn) {
				publishedEl.innerText = item.publishedOn;
			}

			if (descriptionEl && item.description) {
				descriptionEl.innerHTML = item.description;
			}

			if (linkEl && item.link) {
        linkEl.href = item.link;
      }

			this.postsEl.append(el);
		}
	}

	customElements.define(SELECTOR, el);
})()