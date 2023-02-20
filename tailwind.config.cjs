/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: true,
		lightTheme: 'bumblebee',
		darkTheme: 'night'
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	safelist: [
		'tooltip-left', 'tooltip-right',
		'alert-info', 'alert-success', 'alert-error',
		'rating-xs', 'rating-sm', 'rating-md', 'rating-lg'
	]
};
