import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";

export default function Home() {
	return <Layout title="Kanan Board" description="desc">
		<div className="bg-teal min-h-screen">
			<h1 className="text-center">Kanan</h1>
			<div className="bg-green min-h-screen rounded-t-xl">Hey bbg</div>
		</div>
	</Layout>;
}
