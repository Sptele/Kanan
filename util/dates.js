export function fixDates(data) {
	if (!data.creationDate || !data.dueDate) return; // null check

	data.creationDate = new Date(data.creationDate);
	data.dueDate = new Date(data.dueDate);
}

export function fixDate(date) {
	if (!date) return; // null check

	date = new Date(date);
}

/**
 * Formats the date to a string in the format of "Wednesday, July 20, 2022 at 10:59 AM", or if it is recent (today or yesterday),
 * it will just show the time ("Today/Yesterday at 10:59 AM").
 * @param {Date} date - The Date to format
 */
export function formatDate(date) {
	const currDay = new Date();
	if (currDay.toDateString() === date.toDateString()) {
		// Today
		return (
			"Today at " +
			date.toLocaleTimeString(undefined, {
				hour: "numeric",
				minute: "numeric",
			})
		);
	} else if (isYesterday(date)) {
		// Yesterday
		return (
			"Yesterday at " +
			date.toLocaleTimeString(undefined, {
				hour: "numeric",
				minute: "numeric",
			})
		);
	} else {
		return date.toLocaleString(undefined, {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}
}

// Credit for this from Bobby Hadz's blog: https://bobbyhadz.com/blog/javascript-check-if-date-is-yesterday
function isYesterday(date) {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	if (yesterday.toDateString() === date.toDateString()) {
		return true;
	}

	return false;
}
