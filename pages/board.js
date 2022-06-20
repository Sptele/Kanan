import Layout from "../components/Layout";
import List from "../components/List";

import Link from "next/link";
import { useState } from "react";

function ListRenderer({ listsR }) {
	const renders = listsR[0].map((obj, i) => (
		<List
			key={obj.title + "-list-" + i}
			title={obj.title}
			cards={obj.cards}
		/>
	));

	return <div className="flex gap-4">{renders}</div>;
}

export default function Board() {
	const [lists, setLists] = useState([
		{
			title: "List One",
			cards: [
				{
					title: "Card One",
					creationDate: new Date(),
					dueDate: new Date("June 20 2022 3:55:00"),
					isUrgent: false,
				},
			],
		},
		{
			title: "List Two",
			cards: [],
		},
	]);

	/*
		structure of lists:
		{
			title: String,
			cards: [
				{
					title: String,
				}
			]
		}
	*/

	return (
		<Layout title="Kanan Board" description="desc">
			<div className="bg-teal min-h-screen grid grid-rows-board">
				<Link href="/board">
					<a>
						<h1 className="text-center">Kanan</h1>
					</a>
				</Link>
				<div className="bg-green rounded-t-3xl p-4">
					<ListRenderer listsR={[lists, setLists]} />
				</div>
			</div>
		</Layout>
	);
}
