import { DateTimePicker } from "react-rainbow-components";
import { useState, useEffect } from "react";

const handleSubmit = (setShown, isSubmit, setIsSubmit, data, toUpdate) => {
	if (!isSubmit) return;

	const runner = async () => {
		await fetch("/api/card", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: { _id: data._id },
				update: { [toUpdate]: data[toUpdate] },
			}),
		});
	};

	runner();

	setShown(false);
	setIsSubmit(false);
};

export function TitleUpdater({ data, setShown }) {
	const [isSubmit, setIsSubmit] = useState(false);

	useEffect(
		() => handleSubmit(setShown, isSubmit, setIsSubmit, data, "title"),
		[isSubmit, setShown, data]
	);

	return (
		<div className='bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[25rem] border-y-2 border-y-black'>
			<label
				htmlFor='title-updater'
				className='text-white'>
				New title:
			</label>
			<input
				type='text'
				id='title-updater'
				onChange={(e) => (data.title = e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") setIsSubmit(true);
				}}
			/>
			<input
				type='button'
				className='bg-white text-black p-2 rounded-xl'
				onClick={() => setIsSubmit(true)}
				value='Close'
			/>
		</div>
	);
}

export function DescriptionUpdater({ data, setShown }) {
	const [isSubmit, setIsSubmit] = useState(false);
	useEffect(
		() =>
			handleSubmit(setShown, isSubmit, setIsSubmit, data, "description"),
		[isSubmit, setShown, data]
	);

	return (
		<div className='bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[10rem] border-y-2 border-y-black'>
			<label
				htmlFor='desc-updater'
				className='text-white'>
				New Description:
			</label>
			<br />
			<textarea
				type='text'
				id='desc-updater'
				rows='10'
				cols='50'
				onChange={(e) => (data.description = e.target.value)}
			/>
			<br />

			<input
				type='button'
				className='bg-white text-black p-2 rounded-xl mt-2'
				onClick={() => setIsSubmit(true)}
				value='Close'
			/>
		</div>
	);
}

export function DueDateUpdater({ data, setShown }) {
	const [isSubmit, setIsSubmit] = useState(false);
	useEffect(
		() => handleSubmit(setShown, isSubmit, setIsSubmit, data, "dueDate"),
		[isSubmit, setShown, data]
	);

	return (
		<div className='bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[18rem] border-y-2 border-y-black'>
			<label
				htmlFor='due-date-updater'
				className='text-white'>
				New Due Date:
			</label>
			<br />
			<DateTimePicker
				id='due-date-updater'
				value={data.dueDate.toLocaleString()}
				onChange={(value) => (data.dueDate = value)}
				formatStyle='large'
				locale={"en-US"}
				okLabel={"OK"}
				cancelLabel={"CANCEL"}
			/>
			<br />

			<input
				type='button'
				className='bg-white text-black p-2 rounded-xl mt-2'
				onClick={() => setIsSubmit(true)}
				value='Close'
			/>
		</div>
	);
}

export function ListUpdater({ data, cardList, index, lists, setShown }) {
	const [isSubmit, setIsSubmit] = useState(false);
	useEffect(
		() => handleSubmit(setShown, isSubmit, setIsSubmit, data, "listId"),
		[isSubmit, setShown, data]
	);

	return (
		<div className='bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[18rem] border-y-2 border-y-black'>
			<label
				htmlFor='list-updater'
				className='text-white'>
				New List:
			</label>
			<div
				id='list-updater'
				className='grid grid-cols-6 grid-rows-6 gap-1'>
				{lists.map((list) => {
					return (
						<button
							className={
								"text-black p-2 rounded-xl " +
								(list._id === data.listId
									? "bg-yellow"
									: "bg-white")
							}
							key={list._id}
							onClick={() => {
								if (list._id === data.listId) return;

								const runner = async () => {
									await fetch("/api/card/", {
										method: "PATCH",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											query: { _id: data._id },
											update: { listId: list._id },
										}),
									});
								};

								setIsSubmit(true);

								runner();

								cardList.splice(index, 1);

								data.listId = list._id;
								list.cards.push(data);

								setShown(false);
							}}>
							{list.title.length > 7
								? `${list.title.substring(0, 8)}...`
								: list.title}
						</button>
					);
				})}
			</div>

			<input
				type='button'
				className='bg-white text-black p-2 rounded-xl mt-2'
				onClick={() => setShown(false)}
				value='Close'
			/>
		</div>
	);
}

export function ArchiveUpdater({ data, cardList, index, setShown }) {
	const [willDelete, setWillDelete] = useState(false);
	const [hasDeleted, setHasDeleted] = useState(false);
	const [isSubmit, setIsSubmit] = useState(false);

	useEffect(() => {
		if (hasDeleted) {
			const runner = async () => {
				await fetch("/api/card/", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ _id: data._id }),
				});
			};

			runner();

			cardList.splice(index, 1);
			setWillDelete(false);
			setHasDeleted(false);

			router.push(`/boards/${data.boardId}`);
		} else if (isSubmit) {
			const runner = async () => {
				await fetch("/api/card", {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: { _id: data._id },
						update: { isArchived: data.isArchived },
					}),
				});
			};

			runner();

			setShown(false);

			router.push(`/boards/${data.boardId}`);
		}
	}, [hasDeleted, isSubmit, cardList, data, index, setShown]);

	data.isArchived = true; // set archived
	return (
		<div className='bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[18rem] border-y-2 border-y-black flex flex-col justify-center'>
			<label
				htmlFor='due-date-updater'
				className='text-white'>
				Card Archived! (You can also delete it permanently)
			</label>
			<div className='flex flex-row gap-16 justify-center'>
				<input
					type='button'
					className='bg-white text-black p-2 rounded-xl'
					onClick={() => {
						data.isArchived = false;
						setShown(false);
						router.push(`/boards/${data.boardId}`);
					}}
					value={data.isArchived ? "Cancel" : "Archive"}
				/>

				<div className='flex flex-col gap-2'>
					<input
						type='button'
						className='bg-[red] text-black border-2 border-black p-2 rounded-md'
						onClick={() => setWillDelete(!willDelete)}
						value={willDelete ? "Cancel" : "Delete"}
					/>
					{willDelete && (
						<input
							type='button'
							className='bg-[darkred] text-black p-2 border-2 border-black rounded-md'
							onClick={() => {
								setHasDeleted(true);
							}}
							value='Are you sure?'
						/>
					)}
				</div>
			</div>

			<input
				type='button'
				className='bg-white text-black p-2 rounded-xl mt-2 m-auto'
				onClick={() => {
					setIsSubmit(true);
				}}
				value='Close'
			/>
		</div>
	);
}
