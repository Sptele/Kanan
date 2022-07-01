import { getFromCollection, getAllFromCollection, insertToCollection } from "./mongodb";

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
