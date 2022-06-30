import { useState, useReducer } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createCard } from "../components/CreationFactory";
import { DateTimePicker } from "react-rainbow-components";

function DescriptionInput({ description, onChange, onKeyDown }) {
	return (
		<textarea
			value={description}
			onChange={onChange}
			className="border-black border-2 mb-2 w-[100%] h-[20rem] p-2"
			id="card-creator-desc"
			onKeyDown={onKeyDown}
		/>
	);
}

export default function CardCreator({ cards, icards, setCards, setShown }) {
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
			false
		)
	);

	const [isTitleError, setIsTitleError] = useState(false);


	const submit = () => {

		if (!data.title || data.title === '' || data.title === ' ') {
			// Missing title 
			setIsTitleError(true);
			return;
		} else setIsTitleError(false);

		setCards(cards.concat(data));
		icards.push(data);
		setShown(false);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Escape") setShown(false);
		if (e.key === "Enter") submit();
	};

	return (
		<form
			className="p-4 fixed bg-white w-full h-full top-0 left-0 z-[100] overflow-auto"
			onKeyDown={handleKeyPress}
		>
			<div className="m-auto w-[30rem]">
				<label htmlFor="card-creator-title"><span className="required">* </span>Title:</label>
				<input
					type="text"
					name="title"
					id="card-creator-title"
					className={"p-1" + (isTitleError ? " border-2 border-red" : "")}
					onChange={(e) =>
						setData(
							createCard(
								e.target.value,
								data.description,
								data.creationDate,
								data.dueDate,
								data.members,
								data.comments,
								data.isArchived,
								data.isUrgent
							)
						)
					}
					onKeyDown={handleKeyPress}
				/>
				<input
					type="checkbox"
					name="urgent"
					id="card-creator-urgent"
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
								value
							)
						)
					}
					onKeyDown={handleKeyPress}
				/>{" "}
				<label htmlFor="card-creator-urgent">Is Urgent?</label>
			</div>
			<div className="grid grid-cols-2 grid-rows-1 gap-4	">
				<div>
					<label htmlFor="card-creator-desc">
						Description (Supports{" "}
						<Link href="https://commonmark.org/help/">
							<a className="text-cyan-500" target="_blank">
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
									data.isUrgent
								)
							)
						}
						onKeyDown={handleKeyPress}
					/>
				</div>
				<div>
					<label htmlFor="card-creator-prev">
						Description Preview:
					</label>
					<br />
					<div
						className="border-black border-2 mb-2 w-[100%] min-h-[20rem] p-2 bg-[white]"
						id="card-creator-prev"
					>
						<ReactMarkdown
							children={data.description}
							remarkPlugins={[remarkGfm]}
						/>
					</div>
				</div>
			</div>
			<br />
			<div className="mr-4">
				<DateTimePicker
					id="card-creator-creation-date-picker"
					label="Start Date"
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
								data.isUrgent
							)
						)
					}
					formatStyle="large"
					locale={"en-US"}
					okLabel={"OK"}
					cancelLabel={"CANCEL"}
					required
				/>
				<DateTimePicker
					id="card-creator-due-date-picker"
					label="Due Date"
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
								data.isUrgent
							)
						)
					}
					formatStyle="large"
					locale={"en-US"}
					okLabel={"OK"}
					cancelLabel={"CANCEL"}
					required
				/>
			</div>
			<div className="flex content-center">
				<input
					type="button"
					value="Cancel"
					className="bg-red text-white p-4 rounded-full m-auto"
					onClick={() => setShown(false)}
					onKeyDown={handleKeyPress}
				/>
				<input
					type="button"
					value="Create Card"
					className="bg-black text-white p-4 rounded-full m-auto"
					onClick={submit}
					onKeyDown={handleKeyPress}
				/>
			</div>
		</form>
	);
}
