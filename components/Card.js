import { useState, useReducer, createContext, useContext } from "react";
import Image from "next/image";
import ProfilePicture from "../components/ProfilePicture";
import getTimeState from "./getTimeState";
import {
	createMember,
	createComment,
	createCard,
} from "../components/CreationFactory";

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

function Comment({ sender }) {
	return (
		<div className="flex flex-row gap-2">
			<ProfilePicture name={sender.sender.name} className="mt-4" />
			<div className="flex flex-col mt-2">
				<h6>
					{sender.sender.name}
					<span className="text-xs text-slate-500 font-extrabold">
						{sender.sender.role}
					</span>
				</h6>
				<p>{sender.content}</p>
				<p className="text-xs text-slate-500">
					{sender.timeStamp.toLocaleString()}
				</p>
			</div>
		</div>
	);
}

function CommentRenderer({ comments }) {
	return (
		<div className="flex flex-col gap-4">
			{comments.map((comment) => (
				<Comment sender={comment} />
			))}
		</div>
	);
}

function MembersIcons({ members }) {
	return (
		<div className="flex h-8">
			{members.map((member) => (
				<ProfilePicture name={member.name} />
			))}
		</div>
	);
}

function OpenedCard({ data }) {
	const [isOpen, setIsOpen] = useContext(OpenContext);
	const [_, forceUpdate] = useReducer((x) => x + 1, 0);

	const ActionButton = ({ children, onClick }) => {
		return (
			<button
				className="bg-red border-black border-2 w-[20rem] p-1"
				onClick={onClick}
			>
				<h4>{children}</h4>
			</button>
		);
	};

	//const timeState = getTimeState(data.dueDate);
	const timeState = 2;
	return (
		<div
			className={
				"bg-white rounded-[2.5rem] fixed z-50 top-[2vh] left-[2vh] min-w-[98vw] min-h-[96vh] p-4 flex flex-row gap-4" +
				(data.isUrgent || timeState === -1
					? " border-red border-4 "
					: "") +
				(timeState === 0 ? " border-orange-500 border-4" : "") +
				(timeState === 1 ? " border-[green] border-4" : "")
			}
		>
			<div className="w-[75%]">
				<div className="flex flex-row">
					<h1>{data.title} &#9679; </h1>
					<MembersIcons members={data.members} />
				</div>
				<h4>
					Created: {data.creationDate.toLocaleString()} | Due:{" "}
					<strong className={(timeState === -1 ? "text-red" : "")}>{data.dueDate.toLocaleString()}</strong>
				</h4>
				<p className="text-lg border-black border-4 border-solid p-1 w-[100%]">
					<strong>Description:</strong>
					<br /> {data.description}
				</p>
				<div className="flex flex-row gap-1 mt-2">
					<h6 className="mt-2">Comments:</h6>
					<button className="p-2 px-4 bg-yellow border-2 border-black rounded-xl font-extrabold">
						+
					</button>
				</div>
				<CommentRenderer comments={data.comments} />
			</div>
			<div className="flex flex-col gap-2">
				<ActionButton onClick={() => {}}>Add Members</ActionButton>
				<ActionButton
					onClick={() => {
						data.title = prompt(
							"What's the new card name?",
							data.title
						);
						forceUpdate();
					}}
				>
					Set Title
				</ActionButton>
				<ActionButton
					onClick={() => {
						data.description = prompt(
							"What's the new description?",
							data.description
						);
						forceUpdate();
					}}
				>
					Set Description
				</ActionButton>
				<ActionButton onClick={() => {}}>Set Due Date</ActionButton>
				<ActionButton onClick={() => {}}>Change List</ActionButton>
				<ActionButton onClick={() => {}}>Archive</ActionButton>
				<ActionButton onClick={() => setIsOpen(!isOpen)}>
					Close Card
				</ActionButton>
			</div>
		</div>
	);
}

function ClosedCard({ data }) {
	const [isOpen, setIsOpen] = useContext(OpenContext);

	const timeState = getTimeState(data.dueDate);

	return (
		<button
			onClick={() => setIsOpen(!isOpen)}
			className={
				"bg-white rounded-md p-2 m-4 text-center h-14" +
				(data.isUrgent || timeState === -1
					? " border-l-red border-l-4 "
					: "") +
				(timeState === -1 ? " bg-rose-600" : "") +
				(timeState === 0 ? " border-l-orange-500 border-l-4" : "") +
				(timeState === 1 ? " border-l-[green] border-l-4" : "")
			}
		>
			<p className=" leading-4">{data.title}</p>
			<p
				className={
					"text-xs text-slate-500 " +
					(timeState === -1 ? "text-white" : "")
				}
			>
				{(timeState === -1 ? "LATE " : "") +
					data.creationDate.getMonth() +
					"/" +
					data.creationDate.getDate()}{" "}
				- {data.dueDate.getMonth() + "/" + data.dueDate.getDate()}
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
