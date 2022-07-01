import { insertCard } from "../../db/card";

/**
 * This page handles all requests for the CARDS collection in mongodb.
 */
export default async function handler(req, res) {
	if (req.method === "GET") { 
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ message: "Hello World!" }));
	} else if (req.method === 'POST') {

		// Add data
		const response = await insertCard(req.body);

		// Return with what was sent with status code 200
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");
		res.end(JSON.stringify({ card: req.body, response }));
	}
}
