import { useState, createContext, useContext } from "react";
import getTimeState from "./getTimeState";

/*
	{
		title: String,
		description: String,
		creationDate: DateTime,
		dueDate: DateTime,
		members: [],
		comments: [
			{
				sender: <some object that represents a person, so temporarily a String>,
				content: String,
				timeStamp: DateTime
			}...
		],
		isArchived: boolean,
		urgent: boolean
	}
*/
let OpenContext = createContext();

function OpenedCard({ data }) {
	const [isOpen, setIsOpen] = useContext(OpenContext);

	return <div className="">

	</div>;
}

function ClosedCard({ data }) {
	const [isOpen, setIsOpen] = useContext(OpenContext);

	const timeState = getTimeState(data.dueDate);

	return (
		<button
			onClick={() => setIsOpen(!isOpen)}
			className={
				"bg-white rounded-md p-2 m-4 text-center h-14" +
				(data.isUrgent || timeState === -1 ? " border-l-red border-l-4 " : "") +
				(timeState === -1 ? " bg-rose-600" : "") + 
				(timeState === 0 ? " border-l-orange-500 border-l-4" : "") +
				(timeState === 1 ? " border-l-[green] border-l-4" : "")
			}
		>
			<p className=" leading-4">
				{data.title}
			</p>
			<p className={"text-xs text-slate-500 " + (timeState === -1 ? "text-white" : "")}>
				{(timeState === -1 ? "LATE " : "") + data.creationDate.getMonth() + "/" + data.creationDate.getDate()} - {data.dueDate.getMonth() + "/" + data.dueDate.getDate()}
			</p>
		</button>
	);
}

export default function Card({ data }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<OpenContext.Provider value={[isOpen, setIsOpen]}>
			{isOpen ? <OpenedCard data={data} /> : <ClosedCard data={data} />}
		</OpenContext.Provider>
	);
}
