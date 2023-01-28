export const ICONS = [
	{
		name: 'Add Task',
		value: 'add_task'
	},
	{
		name: 'Apps',
		value: 'apps'
	},
	{
		name: 'Arrow Circle Right',
		value: 'arrow_circle_right'
	},
	{
		name: 'Autorenew',
		value: 'autorenew'
	},
	{
		name: 'Block',
		value: 'block'
	},
	{
		name: 'Bolt',
		value: 'bolt'
	},
	{
		name: 'Dataset',
		value: 'dataset'
	},
	{
		name: 'Done Outline',
		value: 'done_outline'
	},
	{
		name: 'Folder',
		value: 'folder'
	},
	{
		name: 'Key',
		value: 'key'
	},
	{
		name: 'Settings',
		value: 'settings'
	},
	{
		name: 'Settings Accessibility',
		value: 'settings_accessibility'
	}
];

export const ICONS_MAP = ICONS
	.reduce((acc, cur) => {
		acc[cur.value] = cur;
		return acc;
	}, {});