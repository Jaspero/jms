import {JSX} from 'definitions';

export const IMAGE_DEFINITION = {
	component: {
		type: 'image',
		configuration: {
			filePrefix: '/public/',
			uploadMethods: [{
				id: 'file-manager',
				label: 'FILE_MANAGER.TITLE',
				component: JSX(<jms-e-file-manager-select/>),
				configuration: {
					route: '/public',
					hidePath: false,
					hideFolders: false,
					filters: [{
						value: file => file.contentType.startsWith('image/')
					}]
				}
			}]
		}
	}
};