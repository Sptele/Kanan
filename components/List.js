import Card from "./Card";
import getTimeState from "./getTimeState";
import { createCard } from "../components/CreationFactory";
import { useState } from "react";
import CardCreator from "../components/CardCreator";

function CardRenderer({ cards, showCardCreator, setShowCardCreator }) {
	return (
		<div className="flex flex-col">
			<button
				className="bg-[#000000bd] text-center rounded-md text-white mx-4 mt-4 p-4 h-14 "
				onClick={() => setShowCardCreator(!showCardCreator)}
			>
				Add a Card +
			</button>

			{cards.map((obj, i) => (
				<Card key={obj.title + "-card-" + i} data={obj} />
			))}
		</div>
	);
}

export default function List({ title, icards }) {
	const [cards, setCards] = useState(icards);
	const [isOpen, setIsOpen] = useState(true);
	const [showCardCreator, setShowCardCreator] = useState(false);

	if (showCardCreator) {
		return (
			<CardCreator
				cards={cards}
				icards={icards}
				setCards={setCards}
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
		const timeState = getTimeState(card.dueDate);

		if (card.isUrgent) bgColor = "bg-red";
		else if (timeState === -1) bgColor = "bg-rose-600";
		else if (timeState === 0) bgColor = "bg-orange-500";
		else if (timeState === 1) bgColor = "bg-[green]";
	});

	return (
		<div
			className={
				"bg-gray rounded-xl relative " +
				(isOpen ? "w-[15rem] pb-4 text-center h-[75vh]" : "min-h-[75vh] w-10")
			}
		>
			<div
				className={
					isOpen
						? " overflow-y-auto max-h-[75vh] overflow-x-hidden "
						: ""
				}
			>
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
						}
					>
						{cards.length > 0 ? (
							cards.length
						) : (
							<button
								onClick={() =>
									setShowCardCreator(!showCardCreator)
								}
							>
								+
							</button>
						)}
					</h6>
				)}
			</div>
			<div
				className={
					isOpen
						? "bottom-0 m-auto absolute w-[15rem]"
						: "absolute bottom-8 right-[-2.5rem] origin-center rotate-90 w-[7rem]"
				}
			>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={
						"inline-block" +
						(isOpen ? " bg-gray p-4 rounded-xl m-auto w-[15rem]" : "")
					}
				>
					<h6>▶ {title}</h6>
				</button>
			</div>
		</div>
	);
}
