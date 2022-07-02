import { deleteCard, insertCard, updateCard, replaceCard } from "../../db/card";

/**
 * This page handles all requests for the CARDS collection in mongodb.
 */
export default async function handler(req, res) {
	return new Promise((resolve, reject) => {
		try {
		if (req.method === "GET") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ message: "Hello World!" }));
		} else if (req.method === "POST") {
			post(req, res);
		} else if (req.method === "DELETE") {
			drop(req, res);
		} else if (req.method === "PUT") {
			replace(req, res);
		} else if (req.method === "PATCH") {
			update(req, res);
		}

		resolve();
	} catch (err) {
		res.statusCode = 405;
		res.end(JSON.stringify(err));
		resolve();
	}
	});
}

async function update(req, res) {
	try {
		// Update data
		const response = await updateCard(req.body.query, {
			$set: req.body.update,
		});

		// Return with what was sent with status code 200
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(response));
	} catch (error) {
		throw error;
	}
}

async function drop(req, res) {
	try {
		// Drop data
		const response = await deleteCard(req.body);

		// Return with what was sent with status code 200
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(response));
	} catch (error) {
		throw error;
	}
}

async function replace(req, res) {
	try {
		// Replace data
		const response = await replaceCard(
			req.body.query,
			req.body.replacement
		);

		// Return with what was sent with status code 200
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(response));
	} catch (error) {
		throw error;
	}
}

async function post(req, res) {
	try {
		// Add data
		const response = await insertCard(req.body);

		// Return with what was sent with status code 200
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ card: req.body, response }));
	} catch (error) {
		throw error;
	}
}
