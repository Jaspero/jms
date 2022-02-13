import {Module} from '../shared/module.type';

export const LAYOUT_HR_MODULE: Module = {
	id: 'settings-hr',
	name: 'WEBSITE.LAYOUT.LAYOUT',
	authorization: {
		write: ['admin']
	},
	layout: {
		directLink: 'layout',
		instance: {
			segments: [
				{
					title: 'WEBSITE.LAYOUT.HEADER_NAVIGATION',
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
			label: 'GENERAL.LINK',
			columnsDesktop: 6
		},
		'headerLinks/label': {
			label: 'GENERAL.LABEL',
			columnsDesktop: 6
		}
	}
}