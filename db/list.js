import { getFromCollection, getAllFromCollection, insertToCollection } from "./mongodb";

/* The following methods are wrappers to generic methods in mongodb.js, specifically to the lists collection. */

export async function insertList(list) {
	const result = await insertToCollection("lists", list);
	return result;
}

export async function getList(query, options={}) {
	const result = await getFromCollection("lists", query, options);
	return result;
}

export async function getAllLists(options={}) {
	const result = await getAllFromCollection("lists", options);
	return result;
}
