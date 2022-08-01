import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Loading from "./Loading";
import PageMeta from "./PageMeta";

export default function Layout({ title, description, children }) {
	const [shown, setShown] = useState(false);

	return (
		<>
			{shown && <Loading text={"Loading..."} />}
			<PageMeta title={title} description={description} />
			<div className='bg-teal min-h-screen grid grid-rows-board'>
				<Link href='/profile'>
					<a onClick={() => setShown(true)}>
						<h1 className='text-center text-black'>Kanan</h1>
					</a>
				</Link>
				<div className='bg-green rounded-t-3xl p-4'>{children}</div>
			</div>
		</>
	);
}
