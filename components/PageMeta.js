import Head from "next/head";

export default function PageMeta({ title, description }) {
	return (
		<Head>
			<title>{title}</title>
			<link rel="icon" href="/kanan.png" />
			<meta name="title" content={title} />
			<meta name="description" content={description} />
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</Head>
	);
}
