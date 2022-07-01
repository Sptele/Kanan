import crypto from "crypto";

/**
 * Generates a random id using Node's Crypto module. The id is a hexadecimal string of length 24.
 * @param {string} length - The length of the id. This is the LENGTH, not the amount of bytes (which is half the length)
 * @returns {string} a random id (not RFC) of length 24, in accordance to MongoDB
 */
export default function randId(length=24) {
	return crypto.randomBytes(length/2).toString('hex');
}

