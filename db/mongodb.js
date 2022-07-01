import { MongoClient } from "mongodb";

let uri = process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB;

let cachedClient = null;
let cachedDb = null;

if (!uri) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

if (!dbName) {
	throw new Error(
		"Please define the MONGODB_DB environment variable inside .env.local"
	);
}

export async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}

	const client = await MongoClient.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const db = await client.db(dbName);

	cachedClient = client;
	cachedDb = db;

	return { client, db };
}

export async function createCollection(name) {
	const { db } = await connectToDatabase();

	db.createCollection(name, (err, res) => {
		if (err) {
			console.error(err);
			return false;
		}
		console.log(`Created ${name}s!`);
	});

	return true;
}

export async function certifyCollection(name) {
	const { db } = await connectToDatabase();

	db.collection(name).findOne({}, (err, res) => {
		if (err) {
			console.error(err);
			return false;
		}
		console.log(`Found ${name}s!`);
	});

	return true;
}

export async function insertToCollection(collection, data) {
	try {
		const { db } = await connectToDatabase();

		const result = await db.collection(collection).insertOne(data);

		return result;
	} catch (err) {
		console.error(err);

		return null;
	}
}

export async function getFromCollection(collection, query, options = {}) {
	try {
		const { db } = await connectToDatabase();

		const result = await db.collection(collection).findOne(query, options);

		console.log(result);

		return JSON.parse(JSON.stringify(result));
	} catch (err) {
		console.error(err);

		return null;
	}
}

export async function getAllFromCollection(collection, options = {}) {
	try {
		const { db } = await connectToDatabase();

		const cursor = await db
			.collection(collection)
			.find({}, options)
			.toArray();

		console.log(cursor);

		return JSON.parse(JSON.stringify(cursor));
	} catch (err) {
		console.error(err);

		return null;
	}
}
