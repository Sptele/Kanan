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

export async function insertList(list) {
	try {
		const { db } = await connectToDatabase();

		const result = await db.insertOne(list);

		return result;
	} catch (err) {
		console.error(err);

		return null;
	}
}

export async function getList(query, options={}) {
	try {
		const { db } = await connectToDatabase();

		const result = await db.collection("lists").findOne(query, options);

		return result;
	} catch (err) {
		console.error(err);

		return null;
	}
}

export async function getAllLists(options={}) {
	try {
		const { db } = await connectToDatabase();

		const cursor = await db.collection("lists").find({}, options);

		return cursor.toArray();
	} catch (err) {
		console.error(err);

		return null;
	}
}


export async function createCollection() {
	const db = await connectToDatabase();
	
	db.createCollection("lists", (err, res) => {
		if (err) throw err;
		console.log("Created lists!");
	});
}

export async function certifyCollection() {
	const db = await connectToDatabase();
	
	db.collection("lists").findOne({}, (err, res) => {
		if (err) throw err;
		console.log("Found lists!");
	});

}