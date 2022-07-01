import {
	getFromCollection,
	getAllFromCollection,
	insertToCollection,
	deleteFromCollection,
	replaceToCollection,
	updateToCollection,
} from "./mongodb";
/* The following methods are wrappers to generic methods in mongodb.js, specifically to the cards collection. */

export async function insertCard(card) {
	const result = await insertToCollection("cards", card);
	return result;
}

export async function getCard(query, options={}) {
	const result = await getFromCollection("cards", query, options);
	return result;
}

export async function getAllCards(options={}) {
	const result = await getAllFromCollection("cards", {}, options);
	return result;
}

export async function deleteCard(query, options={}) {
	const result = await deleteFromCollection("cards", query, options);
	return result;
}

export async function replaceCard(query, replacement, options={}) {
	const result = await replaceToCollection("cards", query, replacement, options);
	return result;
}

export async function updateCard(query, update, options={}) {
	const result = await updateToCollection("cards", query, update, options);
	return result;
}