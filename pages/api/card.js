import { deleteCard, insertCard } from "../../db/card";

/**
 * This page handles all requests for the CARDS collection in mongodb.
 */
export default async function handler(req, res) {
	if (req.method === "GET") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ message: "Hello World!" }));
	} else if (req.method === "POST") {
		post(req, res);
	} else if (req.method === "DELETE") {
		drop(req, res);
	}
}

async function drop(req, res) {
	// Drop data
	const response = await deleteCard(req.body);

	// Return with what was sent with status code 200
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(response));
}

async function post(req, res) {
	// Add data
	const response = await insertCard(req.body);

	// Return with what was sent with status code 200
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ card: req.body, response }));
}
