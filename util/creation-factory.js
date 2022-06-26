import randId from "./random-id";

/**
 * Creates a member object. Similar to `createCard()`, this is an abstraction for making this object.
 * @param {String} name The name of the member.
 * @param {String} biography A biography for the member.
 * @param {String} role The role of the user. You can use this role to assign to a team.
 * @param {String} linkToProfilePicture A URL link as a String to the profile picture.
 * @returns an Object representing this data.
 */
export function createMember(name, biography, role, id=randId()) {
	return { id, name, biography, role };
}

/**
 * Creates a comment object, similar to `createCard()`. This is an abstraction for making this type of object.
 * @param {{ name: String, biography: String, role: String, linkToProfilePicture: String }} sender A sender object created by `createMember()`
 * @param {String} content The content of the comment.
 * @param {Date} timeStamp The date that this comment was created.
 * @returns
 */
export function createComment(sender, content, timeStamp, id=randId()) {
	return { id, sender, content, timeStamp };
}

/**
 * Makes a card object. While you could do it yourself, this function provides a simple abstraction that defines the rules
 * of a card, and allows you to easily create one through one function call.
 * @param {String} title The card title
 * @param {String} description A description (that will hopefully be put through markdown)
 * @param {Date} creationDate When the card was created. This should just be now, and so would be passed in as `new Date()`
 * @param {Date} dueDate When this card is due.
 * @param {Array.<{ name: String, biography: String, role: String, linkToProfilePicture: String }>} members The members to assign this card to. Use the `createMember()` function to make a member.
 * @param {Array.<{ sender: { name: String, biography: String, role: String, linkToProfilePicture: String }, content: String, timeStamp: Date }>} comments The comments on this card. This array WILL be mutated. Use the `createComment()` function to make a comment.
 * @param {boolean} isArchived Whether or not this card is archived, and so is hidden.
 * @param {boolean} isUrgent Whether or not a card is urgent, as in it is top priority.
 * @return an Object representing this data.
 */
export function createCard(
	title,
	description,
	creationDate,
	dueDate,
	members,
	comments,
	isArchived,
	isUrgent,
	listId,
	id=randId(),
) {
	return {
		id,
		title,
		description,
		creationDate,
		dueDate,
		members,
		comments,
		isArchived,
		isUrgent,
		listId
	};
}
