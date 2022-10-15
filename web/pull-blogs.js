import fetch from 'node-fetch';
import {readFileSync, writeFileSync} from 'fs';

async function exec() {
	const res = await fetch(
		`https://firestore.googleapis.com/v1/projects/bioviva-science/databases/(default)/documents:runQuery`,
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

	const items = await res.json();

	writeFileSync(
		'svelte.config.js',
		readFileSync('svelte.config.js')
			.toString()
			.replace(
				`const BLOGS = [];`,
				`const BLOGS = ${JSON.stringify(items.map(doc => `/blog/${doc.document.name.split('/').pop()}`))};`
			)
	)

}

exec()
	.then(() => process.exit(0))
	.catch(e => {
		console.error(e);
		process.exit(1);
	})