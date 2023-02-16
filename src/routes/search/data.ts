export const availableFilters = [
	{
		"name": "Semester",
		"values": [
			{
				fullName: "Wintersemester 2023/24",
				badge: "WS 23/24"
			},
			{
				fullName: "Sommersemester 2023",
				badge: "SS 23"
			}
		]
	},
	{
		"name": "Schwerpunkt",
		"values": [
			{
				fullName: "IT-Security",
				badge: "IT-Security"
			},
			{
				fullName: "Technische Informatik",
				badge: "Technische Informatik"
			},
		]
	},
	{
		"name": "Studiengang",
		"values": [
			{
				fullName: "Informatik",
				badge: "Inf"
			},
			{
				fullName: "Wirtschaftsinformatik",
				badge: "WInf"
			},
			{
				fullName: "Elektrotechnik",
				badge: "ET"
			},
			{
				fullName: "Media Communication and Digital Business",
				badge: "MCD"
			},
		]
	}
];

export const filters = [
	"WS 23/24",
	"IT-Security"
];

export const modules = [
	{
		name: "Kryptologie",
		short: 'KP',
		lecturers: ['Georg Hoever'],
		description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
		reviews: [
			{
				author: null,
				overallStars: 4,
				text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo"
			},
			{
				author: "Jonas",
				overallStars: 5,
				text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo"
			}
		],
		overallStars: 4,
		specificRatings: [
			{
				name: "Spannend",
				stars: 4
			},
			{
				name: 'Übungen',
				stars: 5
			},
			{
				name: 'Klausur',
				stars: 2
			},
			{
				name: 'Leicht',
				stars: 1
			}
		]
	},
	{
		name: "IT-Security",
		short: 'ITS',
		overallStars: 3,
		specificRatings: [
			{
				name: "Spannend",
				stars: 4
			},
			{
				name: 'Übungen',
				stars: 3
			},
			{
				name: 'Klausur',
				stars: 2
			},
			{
				name: 'Leicht',
				stars: 2
			}
		]
	}
];