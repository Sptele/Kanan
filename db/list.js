import {
	getFromCollection,
	getAllFromCollection,
	insertToCollection,
	deleteFromCollection,
	replaceToCollection,
	updateToCollection,
} from "./mongodb";

/* The following methods are wrappers to generic methods in mongodb.js, specifically to the lists collection. */

export async function insertList(list) {
	const result = await insertToCollection("lists", list);
	return result;
}

export async function getList(query, options = {}) {
	const result = await getFromCollection("lists", query, options);
	return result;
}

export async function getAllLists(options = {}) {
	const result = await getAllFromCollection("lists", options);
	return result;
}

export async function deleteList(query, options = {}) {
	const result = await deleteFromCollection("lists", query, options);
	return result;
}

export async function replaceList(query, replacement, options={}) {
	const result = await replaceToCollection("lists", query, replacement, options);
	return result;
}

export async function updateList(query, update, options={}) {
	const result = await updateToCollection("lists", query, update, options);
	return result;
}
