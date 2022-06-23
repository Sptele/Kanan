const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				current: "currentColor",
				blue: "#247BA0",
				teal: "#70C1B3",
				green: "#B2DBBF",
				yellow: "#F3FFBD",
				red: "#FF1654",
				white: "#E0F2E9",
				gray: "#DEDBD2",
			},
			gridTemplateRows: {
				board: "9vh 91vh",
			},
			gridTemplateColumns: {
				card: "2vw 96vw 2vw"
			}
		},
		fontFamily: {
			title: ["Raleway", "san-serif"],
			body: ["Anek Malayalam", "san-serif"],
		},
	},
	plugins: [],
};
