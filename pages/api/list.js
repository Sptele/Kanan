import { deleteList, insertList, updateList, replaceList } from "../../db/list";

/**
 * This page handles all requests for the LIST collection in mongodb.
 */
export default async function handler(req, res) {
	try {
		if (req.method === "GET") {
			res.status(200)
				.setHeader("content-type", "application/json")
				.json({ message: "Hello World!" });
		} else if (req.method === "POST") {
			await post(req, res);
		} else if (req.method === "DELETE") {
			await drop(req, res);
		} else if (req.method === "PUT") {
			await replace(req, res);
		} else if (req.method === "PATCH") {
			await update(req, res);
		}
	} catch (err) {
		res.status(405).setHeader("content-type", "application/json").json(err);
	}
}

async function update(req, res) {
	try {
		// Update data
		const response = await updateList(req.body.query, {
			$set: req.body.update,
		});

		// Return with what was sent with status code 200
		res.status(200)
			.setHeader("content-type", "application/json")
			.json(response);
	} catch (error) {
		throw error;
	}
}

async function drop(req, res) {
	try {
		// Drop data
		const response = await deleteList(req.body);

		// Return with what was sent with status code 200
		res.status(200)
			.setHeader("content-type", "application/json")
			.json(response);
	} catch (error) {
		throw error;
	}
}

async function replace(req, res) {
	try {
		// Replace data
		const response = await replaceList(
			req.body.query,
			req.body.replacement
		);

		// Return with what was sent with status code 200
		res.status(200)
			.setHeader("content-type", "application/json")
			.json(response);
	} catch (error) {
		throw error;
	}
}

async function post(req, res) {
	try {
		// Add data
		const response = await insertList(req.body);

		// Return with what was sent with status code 200
		res.status(200)
			.setHeader("content-type", "application/json")
			.json({ list: req.body, response });
	} catch (error) {
		throw error;
	}
}
