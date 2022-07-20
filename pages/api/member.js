import {
	deleteMember,
	insertMember,
	updateMember,
	replaceMember,
	getMember,
} from "../../db/member";

/**
 * This page handles all requests for the BOARD collection in mongodb.
 */
export default async function handler(req, res) {
	try {
		if (req.method === "GET") {
			await get(req, res);
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

async function get(req, res) {
	try {
		// Get data
		const response = await getMember({ _id: req.body });

		// Return with what was sent with status code 200
		res.status(200)
			.setHeader("content-type", "application/json")
			.json(response);
	} catch (error) {
		throw error;
	}
}

async function update(req, res) {
	try {
		// Update data
		const response = await updateMember(req.body.query, {
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
		const response = await deleteMember(req.body);

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

		console.log(req.body)
		// Replace data
		const response = await replaceMember(
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
		const response = await insertMember(req.body);

		// Return with what was sent with status code 200
		res.status(200)
			.setHeader("content-type", "application/json")
			.json({ member: req.body, response });
	} catch (error) {
		throw error;
	}
}
