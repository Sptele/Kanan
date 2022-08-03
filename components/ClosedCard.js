import { useRouter } from "next/router";
import React, { useState } from "react";
import getTimeState from "../util/get-time-state";

export default function ClosedCard({ data, cardList, index }) {
	const [isDragging, setIsDragging] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	const router = useRouter();

	const redirect = (e) => {
		e.preventDefault();
		setIsClicked(true);
		router.push("/cards/" + data._id);
	};

	const timeState = getTimeState(data.dueDate);
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
				(isDragging ? " cursor-grabbing horizontal-shake" : "") +
				(data.members.length > 0 ? " border-orange-500 border-x-4" : "")
			}
			draggable
			onDragStart={(event) => {
				// Remove this copy from the list
				cardList.splice(index, 1);

				// Data Transfer
				setIsDragging(true);
				event.dataTransfer.setData("id", JSON.stringify(data._id));
				event.dataTransfer.setData(
					"listId",
					JSON.stringify(data.listId)
				);
				event.dataTransfer.effectAllowed = "move";
			}}
			onDragEnd={(_) => setIsDragging(false)}
		>
			<p className="closed-card-title leading-4 text-black">
				{data.title}
			</p>
			<p
				className={
					"text-xs text-slate-500 " +
					(timeState === -1 ? "text-[white]" : "")
				}
			>
				{(data.members.length > 0 ? "[WORKING] " : "") + (timeState === -1 ? "[LATE] " : "") +
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
