import Layout from "../components/Layout";
import List from "../components/List";
import {
	createMember,
	createComment,
	createCard,
} from "../util/creation-factory";
import randId from "../util/random-id";

import Link from "next/link";
import { useState, createContext, useReducer } from "react";
import ListCreator from "../components/creators/ListCreator";

function ListRenderer({ lists, boardId }) {
	const [isOpen, setIsOpen] = useState(false);

	if (isOpen) {
		return <ListCreator lists={lists} boardId={boardId} setShown={setIsOpen} />;
	}

	return (
		<div className="flex gap-4">
			{lists.map((obj, i) => (
				<List
					key={obj.id}
					id={obj.id}
					title={obj.title}
					cards={obj.cards}
					lists={lists}
				/>
			))}
			<button
				className="relative max-h-[75vh] w-10 rounded-xl pt-2 bg-[#000000a8] text-white"
				onClick={() => setIsOpen(!isOpen)}
			>
				<h6 className="absolute right-[-6.5rem] origin-center rotate-90 w-[15rem]">
					Add a new List...
				</h6>
			</button>
		</div>
	);
}

export const ListsContext = createContext();
export const CallbackContext = createContext();

const id1 = randId();
const id2 = randId();

const boardId = randId();

export default function Board({ listsR }) {
	const memberOne = createMember(
		"Gautam Khajuria",
		"The team manager.",
		"Team Manager"
	);
	const memberTwo = createMember("John Doe", "", "");
	const firstComment = createComment(
		memberOne,
		"Hey, this is an important card. Do it fast!",
		new Date()
	);
	const firstCard = createCard(
		"Card One",
		"First Card, please finish Kanan lol",
		new Date(),
		new Date("June 26 2022 14:25:22"),
		[memberOne, memberTwo],
		[firstComment],
		false,
		false,
		null
	);

	const [_, forceUpdate] = useReducer((x) => x + 1, 0);

	const [lists, setLists] = useState([
		...listsR,
		{
			id: id1,
			title: "List One",
			cards: [
				createCard(
					"Card One",
					"First Card, please finish Kanan lol",
					new Date(),
					new Date("June 26 2022 14:25:22"),
					[memberOne, memberTwo],
					[firstComment],
					false,
					false,
					id1
				),
			],
		},
		{
			id: id2,
			title: "List Two that is kinda ocol fsdjifsd;j",
			cards: [],
		},
	]);

	return (
		<Layout title="Kanan Board" description="desc">
			<div className="bg-teal min-h-screen grid grid-rows-board">
				<Link href="/board">
					<a>
						<h1 className="text-center text-black">Kanan</h1>
					</a>
				</Link>
				<div className="bg-green rounded-t-3xl p-4">
					<CallbackContext.Provider value={forceUpdate}>
						<ListsContext.Provider value={[lists, setLists]}>
							<ListRenderer lists={lists} boardId={boardId} />
						</ListsContext.Provider>
					</CallbackContext.Provider>
				</div>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	// ... I should probably store stuff in a db

	const lists = [];

	return {
		props: {
			listsR: lists,
		},
	};
}
