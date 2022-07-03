import {
	getFromCollection,
	getAllFromCollection,
	insertToCollection,
	deleteFromCollection,
	replaceToCollection,
	updateToCollection,
} from "./mongodb";

/* The following methods are wrappers to generic methods in mongodb.js, specifically to the boards collection. */

export async function insertBoard(board) {
	const result = await insertToCollection("boards", board);
	return result;
}

export async function getBoard(query, options={}) {
	const result = await getFromCollection("boards", query, options);
	return result;
}

export async function getAllBoards(options={}) {
	const result = await getAllFromCollection("boards", {}, options);
	return result;
}

export async function deleteBoard(query, options={}) {
	const result = await deleteFromCollection("boards", query, options);
	return result;
}

export async function replaceBoard(query, replacement, options={}) {
	const result = await replaceToCollection("boards", query, replacement, options);
	return result;
}

export async function updateBoard(query, update, options={}) {
	const result = await updateToCollection("boards", query, update, options);
	return result;
}