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
import { getAllLists } from "../db/list";
import { getAllCards } from "../db/card";

function ListRenderer({ lists, boardId }) {
	const [isOpen, setIsOpen] = useState(false);

	if (isOpen) {
		return (
			<ListCreator
				lists={lists}
				boardId={boardId}
				setShown={setIsOpen}
			/>
		);
	}

	return (
		<div className='flex gap-4'>
			{lists.map((obj, i) => (
				<List
					key={obj._id}
					id={obj._id}
					title={obj.title}
					cards={obj.cards}
					lists={lists}
				/>
			))}
			<button
				className='relative max-h-[75vh] w-10 rounded-xl pt-2 bg-[#000000a8] text-white'
				onClick={() => setIsOpen(!isOpen)}>
				<h6 className='absolute right-[-6.5rem] origin-center rotate-90 w-[15rem]'>
					Add a new List...
				</h6>
			</button>
		</div>
	);
}

export const ListsContext = createContext();
export const CallbackContext = createContext();
export const UserContext = createContext();

const boardId = randId();

export default function Board({ listsR }) {
	const currMember = createMember("John Doe", "A user", "Team Manager");

	const [_, forceUpdate] = useReducer((x) => x + 1, 0);

	const [lists, setLists] = useState(listsR);

	return (
		<Layout
			title='Kanan Board'
			description='desc'>
			<UserContext.Provider value={currMember}>
				<CallbackContext.Provider value={forceUpdate}>
					<ListsContext.Provider value={[lists, setLists]}>
						<ListRenderer
							lists={lists}
							boardId={boardId}
						/>
					</ListsContext.Provider>
				</CallbackContext.Provider>
			</UserContext.Provider>
		</Layout>
	);
}

export async function getStaticProps() {
	// ... I should probably store stuff in a db

	const lists = await getAllLists();
	const cards = await getAllCards();

	lists.forEach((list) =>
		cards.forEach((card) => {
			if (card.listId === list.id) {
				card.creationDate = new Date(card.creationDate);
				card.dueDate = new Date(card.dueDate);
				list.cards.push(card);
			}
		})
	);
	console.log(lists);

	return {
		props: {
			listsR: JSON.parse(JSON.stringify(lists)),
		},
	};
}
