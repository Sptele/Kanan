import Head from "next/head";
import Link from "next/link";

export default function Layout({ title, description, children }) {
	return (
		<>
			<Head>
				<title>{title}</title>
				<link
					rel='icon'
					href='/kanan.png'
				/>
				<meta
					title={title}
					description={description}
				/>
			</Head>
			<div className='bg-teal min-h-screen grid grid-rows-board'>
				<Link href='/board'>
					<a>
						<h1 className='text-center text-black'>Kanan</h1>
					</a>
				</Link>
				<div className='bg-green rounded-t-3xl p-4'>
					{children}
				</div>
			</div>
		</>
	);
}
