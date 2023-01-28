export const STORAGE_COLORS = [
	{
		name: 'Default',
		value: 'var(--panel-theme)',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Red',
		value: '#f44336',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Pink',
		value: '#e91e63',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Purple',
		value: '#9c27b0',
		fontColor: 'white'
	},
	{
		name: 'Deep Purple',
		value: '#673ab7',
		fontColor: 'white'
	},
	{
		name: 'Indigo',
		value: '#3f51b5',
		fontColor: 'white'
	},
	{
		name: 'Blue',
		value: '#2196f3',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Light Blue',
		value: '#03a9f4',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Cyan',
		value: '#00bcd4',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Teal',
		value: '#009688',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Green',
		value: '#4caf50',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Light Green',
		value: '#8bc34a',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Lime',
		value: '#cddc39',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Yellow',
		value: '#ffeb3b',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Amber',
		value: '#ffc107',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Orange',
		value: '#ff9800',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Deep Orange',
		value: '#ff5722',
		fontColor: 'rgba(0, 0, 0, 0.65)'
	},
	{
		name: 'Brown',
		value: '#795548',
		fontColor: 'white'
	}
];

export const STORAGE_COLORS_MAP = STORAGE_COLORS
	.reduce((acc, cur) => {
		acc[cur.value] = cur;
		return acc;
	}, {});