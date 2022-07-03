import Layout from "../../components/Layout";
import List from "../../components/List";
import { useState, createContext, useReducer } from "react";
import ListCreator from "../../components/creators/ListCreator";
import { getAllLists } from "../../db/list";
import { getAllCards } from "../../db/card";
import { getAllBoards, getBoard } from "../../db/board";

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
				className={
					lists.length > 0
						? "relative max-h-[75vh] w-10 rounded-xl pt-2 bg-[#000000a8] text-white"
						: "relative w-[15rem] rounded-xl p-2 bg-black text-white"
				}
				onClick={() => setIsOpen(!isOpen)}>
				{lists.length === 0 ? (
					<h6>Add your first list...</h6>
				) : (
					<h6
						className={
							"absolute right-[-6.5rem] origin-center rotate-90 w-[15rem]"
						}>
						Add a new List...
					</h6>
				)}
			</button>
		</div>
	);
}

export const ListsContext = createContext();
export const CallbackContext = createContext();

export default function Board({ listsR, board }) {
	const [_, forceUpdate] = useReducer((x) => x + 1, 0);

	const [lists, setLists] = useState(listsR);

	return (
		<Layout
			title={`${board.title} - Kanan`}
			description='desc'>
			<CallbackContext.Provider value={forceUpdate}>
				<ListsContext.Provider value={[lists, setLists]}>
					<ListRenderer
						lists={lists}
						boardId={board._id}
					/>
				</ListsContext.Provider>
			</CallbackContext.Provider>
		</Layout>
	);
}

export async function getStaticPaths() {
	const lists = await getAllBoards();
	const paths = lists.map((obj) => ({
		params: { id: obj._id },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const lists = await getAllLists();
	const cards = await getAllCards();
	const board = await getBoard({ _id: params.id });

	const listsR = [];

	lists.forEach((list) => {
		if (list.boardId === params.id) {
			cards.forEach((card) => {
				if (card.listId === list._id) {
					list.cards.push(card);
				}
			});
			listsR.push(list);
		}
	});

	return {
		props: {
			listsR: JSON.parse(JSON.stringify(listsR)),
			board,
		},
	};
}
