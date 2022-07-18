import { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createCard } from "../../util/creation-factory";
import { DateTimePicker } from "react-rainbow-components";
import randId from "../../util/random-id";
import { useRouter } from "next/router";

function DescriptionInput({ description, onChange, onKeyDown }) {
	return (
		<textarea
			value={description}
			onChange={onChange}
			className='border-black border-2 ml-0 mb-2 w-[100%] h-[20rem] p-2'
			id='card-creator-desc'
			onKeyDown={onKeyDown}
		/>
	);
}

export default function CardCreator({ listId }) {
	const id = randId();

	const router = useRouter();

	const [data, setData] = useState(
		createCard(
			"",
			"",
			new Date(new Date().setHours(0, 0, 0, 0)),
			new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				new Date().getDate() + 7,
				0,
				0,
				0,
				0
			),
			[],
			[],
			false,
			false,
			listId,
			id
		)
	);
	const [isTitleError, setIsTitleError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isSubmitting) return;

		const runner = async () => {
			await fetch("/api/card", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
		};

		runner();

		router.push(`/cards/${data._id}`);

		setIsSubmitting(false);
	}, [isSubmitting, data]);

	const submit = () => {
		if (!data.title || data.title === "" || data.title === " ") {
			// Missing title
			setIsTitleError(true);
			return;
		} else setIsTitleError(false);

		setIsSubmitting(true);
	};

	const handleKeyPress = (e) => {
		escape(e);
		//if (e.key === "Enter") submit();
	};

	const escape = (e) => {
		if (e.key === "Escape") setShown(false);
	};

	return (
		<form
			className='p-4 fixed bg-white w-full h-full top-0 left-0 z-[100] overflow-auto'
			onKeyDown={handleKeyPress}>
			<div className='m-auto w-[30rem]'>
				<label htmlFor='card-creator-title'>
					<span className='required'>* </span>Title:
				</label>
				<input
					type='text'
					name='title'
					id='card-creator-title'
					className={"p-1"}
					onChange={(e) => {
						if (isTitleError) setIsTitleError(false);

						setData(
							createCard(
								e.target.value,
								data.description,
								data.creationDate,
								data.dueDate,
								data.members,
								data.comments,
								data.isArchived,
								data.isUrgent,
								listId,
								id
							)
						);
					}}
					onKeyDown={handleKeyPress}
				/>
				<input
					type='checkbox'
					name='urgent'
					id='card-creator-urgent'
					onChange={(value) =>
						setData(
							createCard(
								data.title,
								data.description,
								data.creationDate,
								data.dueDate,
								data.members,
								data.comments,
								data.isArchived,
								value,
								listId,
								id
							)
						)
					}
					onKeyDown={handleKeyPress}
				/>{" "}
				<label htmlFor='card-creator-urgent'>Is Urgent?</label>
			</div>
			<div className='grid grid-cols-2 grid-rows-1 gap-4	'>
				<div>
					<label htmlFor='card-creator-desc'>
						Description (Supports{" "}
						<Link href='https://commonmark.org/help/'>
							<a
								className='text-cyan-500'
								target='_blank'>
								Markdown
							</a>
						</Link>
						):
					</label>
					<br />
					<DescriptionInput
						description={data.description}
						onChange={(e) =>
							setData(
								createCard(
									data.title,
									e.target.value,
									data.creationDate,
									data.dueDate,
									data.members,
									data.comments,
									data.isArchived,
									data.isUrgent,
									listId,
									id
								)
							)
						}
						onKeyDown={escape}
					/>
				</div>
				<div>
					<label htmlFor='card-creator-prev'>
						Description Preview:
					</label>
					<br />
					<div
						className='border-black border-2 mt-2 mb-2 w-[100%] min-h-[20rem] p-2 bg-[white]'
						id='card-creator-prev'>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{data.description}
						</ReactMarkdown>
					</div>
				</div>
			</div>
			<br />
			<div className='mr-4'>
				<DateTimePicker
					id='card-creator-creation-date-picker'
					label='Start Date'
					value={data.creationDate.toLocaleString()}
					onChange={(value) =>
						setData(
							createCard(
								data.title,
								data.description,
								new Date(value),
								data.dueDate,
								data.members,
								data.comments,
								data.isArchived,
								data.isUrgent,
								listId,
								id
							)
						)
					}
					formatStyle='large'
					locale={"en-US"}
					okLabel={"OK"}
					cancelLabel={"CANCEL"}
					required
				/>
				<DateTimePicker
					id='card-creator-due-date-picker'
					label='Due Date'
					value={data.dueDate.toLocaleString()}
					onChange={(value) =>
						setData(
							createCard(
								data.title,
								data.description,
								data.creationDate,
								new Date(value),
								data.members,
								data.comments,
								data.isArchived,
								data.isUrgent,
								listId,
								id
							)
						)
					}
					formatStyle='large'
					locale={"en-US"}
					okLabel={"OK"}
					cancelLabel={"CANCEL"}
					required
				/>
			</div>
			<div className='flex content-center'>
				<input
					type='button'
					value='Cancel'
					className='bg-red text-white p-4 rounded-full m-auto'
					onClick={() => setShown(false)}
					onKeyDown={handleKeyPress}
				/>
				<div className='flex flex-col m-auto mt-2'>
					<input
						type='button'
						value='Create Card'
						className={
							"bg-black text-white p-4 rounded-full" +
							(isTitleError ? " border-2 border-red" : "")
						}
						onClick={submit}
						onKeyDown={handleKeyPress}
					/>
					<p
						className={
							"text-xs text-red" +
							(isTitleError ? " visible" : " invisible")
						}>
						You must enter the title!
					</p>
				</div>
			</div>
		</form>
	);
}
