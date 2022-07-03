export default function fixDates(data) {
	data.creationDate = new Date(data.creationDate);
	data.dueDate = new Date(data.dueDate);
}