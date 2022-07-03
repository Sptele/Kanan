import { useState, useReducer, createContext, useContext } from "react";
import Image from "next/image";
import ProfilePicture from "../components/ProfilePicture";
import getTimeState from "../util/get-time-state";
import {
	createMember,
	createComment,
	createCard,
} from "../util/creation-factory";

import {
	TitleUpdater,
	DescriptionUpdater,
	DueDateUpdater,
	ListUpdater,
	ArchiveUpdater,
} from "./card-updaters";

import { ListsContext } from "../pages/boards/[id]";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
			<ProfilePicture name={sender.sender.name} className="mt-4 ml-4" />
			<div className="flex flex-col mt-2">
				<h6>
					{sender.sender.name}
					<span className="text-xs text-slate-500 font-extrabold">
						{sender.sender.role}
					</span>
				</h6>
				<p>{sender.content}</p>
				<p className="text-xs text-slate-500">
					{sender.timeStamp.toLocaleString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
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
			{members.length > 0 ? (
				members.map((member) => <ProfilePicture name={member.name} />)
			) : (
				<h1 className="ml-4">no members :(</h1>
			)}
		</div>
	);
}

function OpenedCard({ data, cardList, index }) {
	const [isOpen, setIsOpen] = useContext(OpenContext);
	const [lists, setLists] = useContext(ListsContext);

	const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
	const [isDescModalOpen, setIsDescModalOpen] = useState(false);
	const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
	const [isListModalOpen, setIsListModalOpen] = useState(false);
	const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

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

	const timeState = getTimeState(data.dueDate);
	return (
		<>
			{isTitleModalOpen ? (
				<TitleUpdater data={data} setShown={setIsTitleModalOpen} />
			) : null}
			{isDescModalOpen ? (
				<DescriptionUpdater data={data} setShown={setIsDescModalOpen} />
			) : null}

			{isDueDateModalOpen ? (
				<DueDateUpdater data={data} setShown={setIsDueDateModalOpen} />
			) : null}

			{isListModalOpen ? (
				<ListUpdater
					data={data}
					cardList={cardList}
					index={index}
					lists={lists}
					setShown={setIsListModalOpen}
				/>
			) : null}

			{isArchiveModalOpen ? (
				<ArchiveUpdater
					data={data}
					cardList={cardList}
					index={index}
					setShown={setIsArchiveModalOpen}
				/>
			) : null}

			<div
				className={
					"bg-white rounded-[2.5rem] fixed z-40 top-[2vh] left-[2vh] min-w-[98vw] min-h-[96vh] p-4 flex flex-row gap-4 text-left" +
					(data.isUrgent || timeState === -1
						? " border-red border-4 "
						: "") +
					(timeState === 0 ? " border-orange-500 border-4" : "") +
					(timeState === 1 ? " border-[green] border-4" : "")
				}
			>
				<div className="w-[75%]">
					<div className="flex flex-row">
						<h1 className="closed-card-title">
							{data.title} &#9679;
						</h1>
						<MembersIcons members={data.members} />
					</div>
					<h4>
						Created: {data.creationDate.toLocaleString()} | Due:{" "}
						<strong className={timeState === -1 ? "text-red" : ""}>
							{data.dueDate.toLocaleString()}
						</strong>
					</h4>
					<div className="text-lg border-black border-4 border-solid p-1 w-[100%]">
						<strong>Description:</strong>
						<ReactMarkdown
							children={data.description}
							remarkPlugins={[remarkGfm]}
						/>
					</div>
					<div className="flex flex-row gap-1 mt-2">
						<h6 className="mt-2">Comments:</h6>
						<button className="p-2 px-4 bg-yellow border-2 border-black rounded-xl font-extrabold">
							+
						</button>
					</div>
					<CommentRenderer comments={data.comments} />
				</div>
				<div className="flex flex-col gap-2">
					<ActionButton onClick={() => { }}>Add Members</ActionButton>
					<ActionButton
						onClick={() => {
							setIsTitleModalOpen(!isTitleModalOpen);
						}}
					>
						Set Title
					</ActionButton>
					<ActionButton
						onClick={() => {
							setIsDescModalOpen(!isDescModalOpen);
						}}
					>
						Set Description
					</ActionButton>
					<ActionButton
						onClick={() =>
							setIsDueDateModalOpen(!isDueDateModalOpen)
						}
					>
						Set Due Date
					</ActionButton>
					<ActionButton
						onClick={() => setIsListModalOpen(!isListModalOpen)}
					>
						Change List
					</ActionButton>
					<ActionButton
						onClick={() =>
							setIsArchiveModalOpen(!isArchiveModalOpen)
						}
					>
						{data.archived ? "Unarchive" : "Archive"}
					</ActionButton>
					<ActionButton onClick={() => setIsOpen(!isOpen)}>
						Close Card
					</ActionButton>
				</div>
			</div>
		</>
	);
}

function ClosedCard({ data, index }) {
	const [isOpen, setIsOpen] = useContext(OpenContext);
	const [isDragging, setIsDragging] = useState(false);

	const timeState = getTimeState(data.dueDate);

	return (
		<button
			onClick={() => setIsOpen(!isOpen)}
			className={
				"bg-white rounded-md p-3 mx-4 mt-4 text-center min-h-14" +
				(data.isUrgent || timeState === -1
					? " border-l-red border-l-4 "
					: "") +
				(timeState === -1 ? " bg-rose-600" : "") +
				(timeState === 0 ? " border-l-orange-500 border-l-4" : "") +
				(timeState === 1 ? " border-l-[green] border-l-4" : "") +
				(isDragging ? " cursor-grabbing horizontal-shake" : "")
			}
			draggable
			onDragStart={(event) => {
				event.dataTransfer.setData("card", JSON.stringify(data));
				event.dataTransfer.setData(
					"cardList",
					JSON.stringify(data.listId)
				);
				event.dataTransfer.setData("cardIndex", JSON.stringify(index));

				setIsDragging(true);
			}}
			onDragEnd={(_) => setIsDragging(false)}
		>
			<p className="closed-card-title leading-4">{data.title}</p>
			<p
				className={
					"text-xs text-slate-500 " +
					(timeState === -1 ? "text-[white]" : "")
				}
			>
				{(timeState === -1 ? "LATE " : "") +
					data.creationDate.toLocaleString("en-US", {
						month: "numeric",
						year: "2-digit",
					})}{" "}
				-{" "}
				{data.dueDate.toLocaleString("en-US", {
					month: "numeric",
					day: "numeric",
				})}
			</p>
		</button>
	);
}

export default function Card({ data, cardList, myIndex }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<OpenContext.Provider value={[isOpen, setIsOpen]}>
			{isOpen ? (
				<OpenedCard data={data} cardList={cardList} index={myIndex} />
			) : (
				<ClosedCard data={data} cardList={cardList} index={myIndex} />
			)}
		</OpenContext.Provider>
	);
}
