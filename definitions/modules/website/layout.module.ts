import {Module} from '../../interfaces/module.interface';

export const LAYOUT_MODULE: Module = {
	id: 'settings',
	name: 'LAYOUT',
	authorization: {
		write: ['admin']
	},
	layout: {
		directLink: 'layout',
		instance: {
			segments: [
				{
					title: 'HEADER_NAVIGATION',
					array: '/headerLinks',
					fields: ['/link', '/label'],
					columnsDesktop: 12
				}
			]
		}
	},
	schema: {
		properties: {
			id: {type: 'string'},
			headerLinks: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						link: {type: 'string'},
						label: {type: 'string'}
					}
				}
			}
		}
	},
	definitions: {
		'headerLinks/link': {
			label: 'LINK',
			columnsDesktop: 6
		},
		'headerLinks/label': {
			label: 'LABEL',
			columnsDesktop: 6
		}
	}
}