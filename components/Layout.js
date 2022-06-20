import Head from "next/head";

export default function Layout({ title, description, children }) {
	return (
		<>
			<Head>
				<title>{title}</title>
				<link
					rel="shortcut icon"
					href="/kanan.png"
				/>
				<meta title={title} description={description} />
			</Head>
			<div>
				{children}
			</div>
		</>
	);
}
