import { ClosedCard } from "./card";
import getTimeState from "../util/get-time-state";
import { useState, useContext, useReducer } from "react";
import { LRContext, CallbackContext } from "../pages/boards/[id]";
import Link from "next/link";
import { fixDates } from "../util/dates";

function CardRenderer({ cards, id }) {
	return (
		<div className='flex flex-col'>
			<Link href={`/cards/new/${id}`}>
				<a className='bg-[#000000bd] text-center rounded-md text-white mx-4 mt-4 p-4 h-14 '>
					Add a Card +
				</a>
			</Link>
			{cards
				.filter((obj) => !obj.isArchived)
				.map((obj, i) => (
					<ClosedCard
						key={obj._id}
						data={obj}
						index={i}
					/>
				))}
		</div>
	);
}

export default function List({ title, id, cards, index, lists }) {
	const [isOpen, setIsOpen] = useState(true);
	const forceUpdate = useContext(CallbackContext);
	const lrForceUpdate = useContext(LRContext);
	const [_, myForceUpdate] = useReducer((x) => x + 1, 0);


	let bgColor = "bg-black";
	cards.forEach((card, i) => {
		card.creationDate = new Date(card.creationDate);
		card.dueDate = new Date(card.dueDate);

		const timeState = getTimeState(card.dueDate);

		if (card.isUrgent) bgColor = "bg-red";
		else if (timeState === -1) bgColor = "bg-rose-600";
		else if (timeState === 0) bgColor = "bg-orange-500";
		else if (timeState === 1) bgColor = "bg-[green]";
	});

	return (
		<div
			onDragOver={(event) => event.preventDefault()}
			onDrop={(event) => {
				const data = JSON.parse(event.dataTransfer.getData("card"));
				const cardIndex = JSON.parse(
					event.dataTransfer.getData("cardIndex")
				);

				data.listId = id;
				fixDates(data);

				lists[index].cards.splice(cardIndex, 1);
				console.log(lists[index].cards)
				cards.push(data);

				const runner = async () => {
					await fetch("/api/card/", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							query: { _id: data._id },
							update: {
								listId: data.listId,
							},
						}),
					});
				};

				runner();
				lrForceUpdate();
				forceUpdate();
				myForceUpdate();
			}}>
			<div
				className={
					"bg-gray relative list " +
					(isOpen
						? "w-[15rem] pb-4 rounded-t-xl text-center h-[75vh]"
						: "min-h-[75vh] w-10 rounded-xl pt-2")
				}>
				<div
					className={
						isOpen
							? " overflow-y-auto max-h-[75vh] overflow-x-hidden "
							: ""
					}>
					{isOpen ? (
						<CardRenderer
							cards={cards}
							id={id}
						/>
					) : (
						<h6
							className={
								`text-white text-center m-2 p-1 rounded-full ` +
								bgColor
							}>
							<Link href={`/cards/new/${id}`}>
								<a className='text-white'>
									{" "}
									{cards.length > 0 ? cards.length : "+"}
								</a>
							</Link>
						</h6>
					)}
				</div>
				{!isOpen && (
					<div
						className={
							"absolute bottom-8 right-[-2.5rem] origin-center rotate-90 w-[7rem]"
						}>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={"inline-block"}>
							<h6>
								{title.length > 8
									? `▶ ${title.substring(0, 7)}...`
									: `▶ ${title}`}
							</h6>
						</button>
					</div>
				)}
			</div>
			{isOpen && (
				<div className={"bottom-0 m-auto w-[15rem]"}>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className={
							"inline-block bg-gray p-4 rounded-b-xl m-auto w-[15rem]"
						}>
						<h6>▶ {title}</h6>
					</button>
				</div>
			)}
		</div>
	);
}
