export default function fixDates(data) {
	if (!data.creationDate || !data.dueDate) return; // null check

	data.creationDate = new Date(data.creationDate);
	data.dueDate = new Date(data.dueDate);
}
