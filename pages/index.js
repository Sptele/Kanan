import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import CardCreator from "../components/CardCreator";

export default function Home() {
	return <CardCreator cards={[]} />
}
