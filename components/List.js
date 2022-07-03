import Card from "./Card";
import getTimeState from "../util/get-time-state";
import { useState, useContext } from "react";
import CardCreator from "./creators/CardCreator";
import { CallbackContext } from "../pages/boards/[id]";

function CardRenderer({ cards, showCardCreator, setShowCardCreator }) {
	return (
		<div className='flex flex-col'>
			<button
				className='bg-[#000000bd] text-center rounded-md text-white mx-4 mt-4 p-4 h-14 '
				onClick={() => setShowCardCreator(!showCardCreator)}>
				Add a Card +
			</button>
			{cards
				.filter((obj) => !obj.isArchived)
				.map((obj, i) => (
					<Card
						key={obj._id}
						data={obj}
						cardList={cards}
						myIndex={i}
					/>
				))}
		</div>
	);
}

export default function List({ title, id, cards, lists }) {
	const [isOpen, setIsOpen] = useState(true);
	const [showCardCreator, setShowCardCreator] = useState(false);
	const forceUpdate = useContext(CallbackContext);

	if (showCardCreator) {
		return (
			<CardCreator
				cards={cards}
				listId={id}
				setShown={setShowCardCreator}
			/>
		);
	}

	let bgColor = "bg-black";

	/*
		(data.isUrgent || timeState === -1 ? " border-l-red border-l-4 " : "") +
				(timeState === -1 ? " bg-rose-600" : "") + 
				(timeState === 0 ? " border-l-orange-500 border-l-4" : "") +
				(timeState === 1 ? " border-l-[green] border-l-4" : "")
	*/

	cards.forEach((card) => {
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
				const cardList = JSON.parse(
					event.dataTransfer.getData("cardList")
				);
				const cardIndex = JSON.parse(
					event.dataTransfer.getData("cardIndex")
				);

				lists
					.filter((obj) => obj._id === cardList)[0]
					.cards.splice(cardIndex, 1);

				data.listId = id;
				data.creationDate = new Date(data.creationDate);
				data.dueDate = new Date(data.dueDate);

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
								creationDate: data.creationDate,
								dueDate: data.dueDate,
							},
						}),
					});
				};

				cards.push(data);

				runner();

				forceUpdate();
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
							showCardCreator={showCardCreator}
							setShowCardCreator={setShowCardCreator}
						/>
					) : (
						<h6
							className={
								`text-white text-center m-2 p-1 rounded-full ` +
								bgColor
							}>
							<button
								onClick={() =>
									setShowCardCreator(!showCardCreator)
								}>
								{cards.length > 0 ? cards.length : "+"}
							</button>
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
