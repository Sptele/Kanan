import {
	getFromCollection,
	getAllFromCollection,
	insertToCollection,
	deleteFromCollection,
	replaceToCollection,
	updateToCollection,
} from "./mongodb";

/* The following methods are wrappers to generic methods in mongodb.js, specifically to the member collection. */

export async function insertMember(member) {
	const result = await insertToCollection("members", member);
	return result;
}

export async function getMember(query, options={}) {
	const result = await getFromCollection("members", query, options);
	return result;
}

export async function getAllMembers(options={}) {
	const result = await getAllFromCollection("members", {}, options);
	return result;
}

export async function deleteMember(query, options={}) {
	const result = await deleteFromCollection("members", query, options);
	return result;
}

export async function replaceMember(query, replacement, options={}) {
	const result = await replaceToCollection("members", query, replacement, options);
	return result;
}

export async function updateMember(query, update, options={}) {
	const result = await updateToCollection("members", query, update, options);
	return result;
}