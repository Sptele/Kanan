import { getCard, getAllCards } from "../../db/card";
import { getAllLists } from "../../db/list";
import { SWRConfig } from "swr";
import React, { useContext, useEffect, useState } from "react";
import getTimeState from "../../util/get-time-state";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import useSWR from "swr";
import fetcher from "../../util/fetcher";
import { fixDates, fixDate, formatDate } from "../../util/dates";
import {
	ArchiveUpdater,
	DescriptionUpdater,
	DueDateUpdater,
	ListUpdater,
	TitleUpdater,
} from "../../components/card-updaters";
import Link from "next/link";
import ProfilePicture from "../../components/ProfilePicture";
import { createComment } from "../../util/creation-factory";
import PageMeta from "../../components/PageMeta";
import { getMember } from "../../db/member";

function Comment({ sender }) {
	fixDate(sender.timeStamp);
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
					{formatDate(sender.timeStamp)}
				</p>
			</div>
		</div>
	);
}

function CommentCreator({ cardId, member, allComments }) {
	const [data, setData] = useState(createComment(member, "", new Date()));
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isSubmitting) return;
		if (data.content.length === 0) {
			setIsOpen(false);
			return;
		}

		allComments.push(data);

		const runner = async () => {
			await fetch("/api/card/", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: { _id: cardId },
					update: { comments: allComments },
				}),
			});
		};

		runner();

		setIsOpen(false);
		setIsSubmitting(false);
	}, [isSubmitting]);

	return (
		<div>
			{isOpen ? (
				<form>
					<input
						type="text"
						onChange={(e) =>
							setData(
								createComment(
									data.sender,
									e.target.value,
									data.timeStamp,
									data._id
								)
							)
						}
						className="p-1"
						placeholder="Type a comment..."
					/>
					<input
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setIsSubmitting(!isSubmitting);
						}}
						className="rounded-full p-2 bg-black text-white"
						value={data.content.length > 0 ? "Submit" : "Cancel"}
					/>
				</form>
			) : (
				<button
					onClick={() => {
						setIsOpen(!isOpen);
					}}
					className={
						"p-2 px-4 bg-yellow border-2 border-black rounded-xl font-extrabold "
					}
				>
					+
				</button>
			)}
		</div>
	);
}

function CommentRenderer({ comments }) {
	return (
		<div className="flex flex-col gap-4">
			{comments.map((comment) => (
				<Comment key={"comment-" + comment._id} sender={comment} />
			))}
		</div>
	);
}

function MembersIcons({ members }) {
	return (
		<div className="flex h-8">
			{members.length > 0 ? (
				members.map((member) => (
					<ProfilePicture
						key={"profile-picture-" + member._id}
						name={member.name}
					/>
				))
			) : (
				<h1 className="ml-4">waiting... 😴</h1>
			)}
		</div>
	);
}

export function OpenedCard() {
	const { data } = useSWR("/api/data/", fetcher);
	const { data: member } = useSWR("/api/member-signed-c/", fetcher);
	const { data: cardList } = useSWR("/api/cardList/", fetcher);
	const { data: index } = useSWR("/api/index/", fetcher);
	const { data: lists } = useSWR("/api/lists/", fetcher);

	const [isWorking, setIsWorking] = useState(false);
	const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
	const [isDescModalOpen, setIsDescModalOpen] = useState(false);
	const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
	const [isListModalOpen, setIsListModalOpen] = useState(false);
	const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

	const ActionButton = ({ children, onClick }) => {
		return (
			<button
				className="bg-red border-black border-2 w-[20rem] p-1"
				onClick={onClick ? onClick : null}
			>
				<h4>{children}</h4>
			</button>
		);
	};

	fixDates(data);
	const timeState = getTimeState(data.dueDate);

	useEffect(() => {
		if (!isWorking) return;

		data.members.push(member);

		const runner = async () => {
			await fetcher('/api/card/', {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: { _id: data._id },
					update: { members: data.members },
				})
			});
		};

		runner();
		
		setIsWorking(false);
	})

	return (
		<>
			<PageMeta title={"Kanan - " + data.title} description={"Card Description: " + data.description} />
			<div className={!isTitleModalOpen && "hidden"}>
				<TitleUpdater data={data} setShown={setIsTitleModalOpen} />
			</div>
			<div className={!isDescModalOpen && "hidden"}>
				<DescriptionUpdater data={data} setShown={setIsDescModalOpen} />
			</div>
			<div className={!isDueDateModalOpen && "hidden"}>
				<DueDateUpdater data={data} setShown={setIsDueDateModalOpen} />
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

			{isArchiveModalOpen && (
				<ArchiveUpdater
					data={data}
					cardList={cardList.cards}
					boardId={cardList.boardId}
					index={index}
					setShown={setIsArchiveModalOpen}
				/>
			)}

			<div
				className={
					"bg-white rounded-[2.5rem] fixed z-40 top-[2vh] left-[2vh] min-w-[98vw] min-h-[96vh] p-4 flex flex-row gap-4 text-left" +
					(data.isUrgent || timeState === -1
						? " border-red border-4 "
						: "") +
					(timeState === 0 ? " border-orange-500 border-4" : "") +
					(timeState === 1 ? " border-[green] border-4" : "") +
					(data.isArchived ? " border-l-[yellow] border-l-8" : "")
				}
			>
				<div className="w-[75%]">
					<div className="flex flex-row">
						<h1 className="closed-card-title">
							{data.title} &#9679;{" "}
						</h1>
						<MembersIcons members={data.members} />
					</div>
					<h4>
						Created: {data.creationDate?.toLocaleString()} | Due:{" "}
						<strong className={timeState === -1 ? "text-red" : ""}>
							{data.dueDate?.toLocaleString()}
						</strong>
					</h4>
					<div className="text-lg border-black border-4 border-solid p-1 w-[100%]">
						<h2 className={!data.isArchived && "hidden"}>
							[ARCHIVED]
						</h2>
						<strong>Description:</strong>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{data.description}
						</ReactMarkdown>
					</div>
					<div className="flex flex-row gap-1 mt-2">
						<h6 className="mt-2">Comments:</h6>
						<CommentCreator
							cardId={data._id}
							member={member}
							allComments={data.comments}
						/>
					</div>
					<CommentRenderer comments={data.comments} />
				</div>
				<div className="flex flex-col gap-2">
					<ActionButton onClick={() => setIsWorking(!isWorking)}>
						Start Working
					</ActionButton>
					<ActionButton
						onClick={() => setIsTitleModalOpen(!isTitleModalOpen)}
					>
						Set Title
					</ActionButton>
					<ActionButton
						onClick={() => setIsDescModalOpen(!isDescModalOpen)}
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
						{data.isArchived ? "Unarchive" : "Archive"}
					</ActionButton>
					<ActionButton>
						<Link href={`/boards/${cardList.boardId}`}>
							<a className="text-black">
								<h4>Close Card</h4>
							</a>
						</Link>
					</ActionButton>
				</div>
			</div>
		</>
	);
}

export default function Page({ fallback }) {
	return (
		<SWRConfig value={{ fallback }}>
			<OpenedCard />
		</SWRConfig>
	);
}

export async function getStaticPaths() {
	const cards = await getAllCards();
	const paths = cards.map((obj) => ({
		params: { id: obj._id },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const data = await getCard({ _id: params.id });
	const allLists = await getAllLists();
	const member = await getMember({ isSignedIn: true });
	const cardList = allLists.filter((list) => list._id === data.listId)[0];
	const index = cardList.cards.findIndex((card) => card._id === data._id);

	return {
		props: {
			fallback: {
				"/api/data/": data,
				"/api/cardList/": cardList,
				"/api/index/": index,
				"/api/lists/": allLists,
				"/api/member-signed-c/": member
			},
		},
	};
}
