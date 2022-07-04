import React, { useState } from "react";
import getTimeState from "../util/get-time-state";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import OpenCardData from "./OpenCardData";
import useSWR from "swr";
import fetcher from "../util/fetcher";

function SkeletonLoader() {
	return (
		<div>
			<Skeleton
				height='3.75rem'
				width='75%'
			/>
		</div>
	);
}

export function OpenedCard() {
	const { data } = useSWR("/api/data/", fetcher);

	return <>{data ? <OpenCardData data={data} /> : <SkeletonLoader />}</>;
}

export function ClosedCard({ data, index }) {
	const [isDragging, setIsDragging] = useState(false);
	const router = useRouter();

	const timeState = getTimeState(data.dueDate);

	return (
		<button
			onClick={() => router.push("/cards/" + data._id)}
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
