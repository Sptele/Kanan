import React, { useState } from "react";
import getTimeState from "../util/get-time-state";
import { useRouter } from "next/router";
import CardSkeleton from "./skeletons/CardSkeleton";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import useSWR from "swr";
import fetcher from "../util/fetcher";
import fixDates from "../util/fix-dates";
import {
	ArchiveUpdater,
	DescriptionUpdater,
	DueDateUpdater,
	ListUpdater,
	TitleUpdater,
} from "./card-updaters";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import Head from "next/head";

function Comment({ sender }) {
	return (
		<div className='flex flex-row gap-2'>
			<ProfilePicture
				name={sender.sender.name}
				className='mt-4 ml-4'
			/>
			<div className='flex flex-col mt-2'>
				<h6>
					{sender.sender.name}
					<span className='text-xs text-slate-500 font-extrabold'>
						{sender.sender.role}
					</span>
				</h6>
				<p>{sender.content}</p>
				<p className='text-xs text-slate-500'>
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
		<div className='flex flex-col gap-4'>
			{comments.map((comment) => (
				<Comment
					key={"comment-" + comment._id}
					sender={comment}
				/>
			))}
		</div>
	);
}

function MembersIcons({ members }) {
	return (
		<div className='flex h-8'>
			{members.length > 0 ? (
				members.map((member) => (
					<ProfilePicture
						key={"profile-picture-" + member._id}
						name={member.name}
					/>
				))
			) : (
				<h1 className='ml-4'>no members :(</h1>
			)}
		</div>
	);
}

export function OpenedCard() {
	const { data } = useSWR("/api/data/", fetcher);
	const { data: cardList } = useSWR("/api/cardList/", fetcher);
	const { data: index } = useSWR("/api/index/", fetcher);
	const { data: lists } = useSWR("/api/lists/", fetcher);

	const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
	const [isDescModalOpen, setIsDescModalOpen] = useState(false);
	const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
	const [isListModalOpen, setIsListModalOpen] = useState(false);
	const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

	const ActionButton = ({ children, onClick }) => {
		return (
			<button
				className='bg-red border-black border-2 w-[20rem] p-1'
				onClick={onClick ? onClick : null}>
				<h4>{children}</h4>
			</button>
		);
	};

	fixDates(data);

	const timeState = getTimeState(data.dueDate);

	return (
		<>
			<Head>
				<title>{data.title}</title>
			</Head>
			<div className={!isTitleModalOpen && "hidden"}>
				<TitleUpdater
					data={data}
					setShown={setIsTitleModalOpen}
				/>
			</div>
			<div className={!isDescModalOpen && "hidden"}>
				<DescriptionUpdater
					data={data}
					setShown={setIsDescModalOpen}
				/>
			</div>
			<div className={!isDueDateModalOpen && "hidden"}>
				<DueDateUpdater
					data={data}
					setShown={setIsDueDateModalOpen}
				/>
			</div>

			<div className={!isListModalOpen && "hidden"}>
				<ListUpdater
					data={data}
					cardList={cardList.cards}
					index={index}
					lists={lists}
					setShown={setIsListModalOpen}
				/>
			</div>

			<div className={!isArchiveModalOpen && "hidden"}>
				<ArchiveUpdater
					data={data}
					cardList={cardList.cards}
					index={index}
					setShown={setIsArchiveModalOpen}
				/>
			</div>

			<div
				className={
					"bg-white rounded-[2.5rem] fixed z-40 top-[2vh] left-[2vh] min-w-[98vw] min-h-[96vh] p-4 flex flex-row gap-4 text-left" +
					(data.isUrgent || timeState === -1
						? " border-red border-4 "
						: "") +
					(timeState === 0 ? " border-orange-500 border-4" : "") +
					(timeState === 1 ? " border-[green] border-4" : "") +
					(data.isArchived ? " border-l-[yellow] border-l-8" : "")
				}>
				<div className='w-[75%]'>
					<div className='flex flex-row'>
						<h1 className='closed-card-title'>
							{data.title} &#9679;
						</h1>
						<MembersIcons members={data.members} />
					</div>
					<h4>
						Created: {data.creationDate?.toLocaleString()} | Due:{" "}
						<strong className={timeState === -1 ? "text-red" : ""}>
							{data.dueDate?.toLocaleString()}
						</strong>
					</h4>
					<div className='text-lg border-black border-4 border-solid p-1 w-[100%]'>
						<strong>Description:</strong>
						<h2 className={!data.isArchived && "hidden"}>
							[ARCHIVED]
						</h2>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{data.description}
						</ReactMarkdown>
					</div>
					<div className='flex flex-row gap-1 mt-2'>
						<h6 className='mt-2'>Comments:</h6>
						<button className='p-2 px-4 bg-yellow border-2 border-black rounded-xl font-extrabold'>
							+
						</button>
						
					</div>
					<CommentRenderer comments={data.comments} />
				</div>
				<div className='flex flex-col gap-2'>
					<ActionButton onClick={() => {}}>Add Members</ActionButton>
					<ActionButton
						onClick={() => {
							setIsTitleModalOpen(!isTitleModalOpen);
						}}>
						Set Title
					</ActionButton>
					<ActionButton
						onClick={() => {
							setIsDescModalOpen(!isDescModalOpen);
						}}>
						Set Description
					</ActionButton>
					<ActionButton
						onClick={() =>
							setIsDueDateModalOpen(!isDueDateModalOpen)
						}>
						Set Due Date
					</ActionButton>
					<ActionButton
						onClick={() => setIsListModalOpen(!isListModalOpen)}>
						Change List
					</ActionButton>
					<ActionButton
						onClick={() =>
							setIsArchiveModalOpen(!isArchiveModalOpen)
						}>
						{data.archived ? "Unarchive" : "Archive"}
					</ActionButton>
					<ActionButton>
						<Link href={`/boards/${cardList.boardId}`}>
							<a className='text-black'>
								<h4>Close Card</h4>
							</a>
						</Link>
					</ActionButton>
				</div>
			</div>
		</>
	);
}

export function ClosedCard({ data, index }) {
	const [isDragging, setIsDragging] = useState(false);
	const [isClicked, setIsClicked] = useState(false);
	const router = useRouter();

	const redirect = () => {
		setIsClicked(true);
		router.push("/cards/" + data._id);
	};

	const timeState = getTimeState(data.dueDate);

	if (isClicked) {
		return <CardSkeleton />;
	}

	return (
		<button
			onClick={redirect}
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
			onDragEnd={(_) => setIsDragging(false)}>
			<p className='closed-card-title leading-4 text-black'>
				{data.title}
			</p>
			<p
				className={
					"text-xs text-slate-500 " +
					(timeState === -1 ? "text-[white]" : "")
				}>
				{(timeState === -1 ? "LATE " : "") +
					data.creationDate.toLocaleString("en-US", {
						month: "numeric",
						day: "numeric",
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
