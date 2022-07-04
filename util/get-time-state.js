export default function getTimeState(dueDate) {
	if (!dueDate) return;

	const timeToDue = dueDate.getTime() - new Date().getTime();

	if (timeToDue <= 0) {
		return -1; // Signifies LATE, AKA URGENT
	} else if (timeToDue <= 86400000) {
		// 1 day left
		return 0;
	} else if (timeToDue <= 259200000) {
		// 7 days (1 week) left
		return 1;
	} else {
		return 2;
	}
}
