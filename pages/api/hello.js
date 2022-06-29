// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
	res.status(200).json({
		info: "All data is exposed through this api so that you can access it in your own programs.",
	});
}
