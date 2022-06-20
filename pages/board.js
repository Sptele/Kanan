import Layout from "../components/Layout";
import List from "../components/List";
import { createMember, createComment, createCard } from "../components/CreationFactory";

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
	const memberOne = createMember("Gautam Khajuria", "The team manager.", "Team Manager");
	const memberTwo = createMember("John Doe", "", "");
	const firstComment = createComment(memberOne, "Hey, this is an important card. Do it fast!", new Date());
	const firstCard = createCard(
		"Card One", "First Card, please finish Kanan lol", new Date(), new Date("June 26 2022 14:25:22"),
		[memberOne, memberTwo], [firstComment], false, false
	);

	const [lists, setLists] = useState([
		{
			title: "List One",
			cards: [
				firstCard,
				
			],
		},
		{
			title: "List Two",
			cards: [
				firstCard
			],
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
