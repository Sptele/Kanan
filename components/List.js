import Card from "./Card";
import getTimeState from "./getTimeState";
import { useState } from "react";

function CardRenderer({ cards }) {
	return (
		<div className="flex flex-col gap-2">
			{cards.length > 0 ? (
				cards.map((obj, i) => (
					<Card key={obj.title + "-card-" + i} data={obj} />
				))
			) : (
				<button className="bg-[#000000bd] text-center rounded-md text-white m-4 p-4 h-14 ">
					Add a Card +
				</button>
			)}
		</div>
	);
}

export default function List({ title, cards }) {
	const [isOpen, setIsOpen] = useState(true);

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
				"bg-gray rounded-xl min-h-[75vh] relative " +
				(isOpen ? "w-[15rem]" : " w-10")
			}
		>
			{isOpen ? (
				<CardRenderer cards={cards} />
			) : (
				<h6
					className={
						`text-white text-center m-2 p-1 rounded-full ` + bgColor
					}
				>
					{cards.length > 0 ? cards.length : <button>+</button>}
				</h6>
			)}
			<div
				className={
					isOpen
						? "bottom-1 left-16 m-auto absolute w-[10rem]"
						: "absolute bottom-8 right-[-2.5rem] origin-center rotate-90 w-[7rem]"
				}
			>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="inline-block"
				>
					<h6>▶ {title}</h6>
				</button>
			</div>
		</div>
	);
}
