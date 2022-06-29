import { useState } from "react";
import { createList } from "../../util/creation-factory";

export default function ListCreator({ lists, boardId, setShown }) {
	const [title, setTitle] = useState("");
	const [error, isError] = useState(false);

	const submit = () => {
		lists.push(createList(title, boardId, []));
		setShown(false);
	};

	const handleKeypress = (e) => {
		if (e.key === "Escape") setShown(false);
		if (e.key === "Enter") submit();
	};

	return (
		<form
			className="p-4 fixed bg-white w-full h-full top-0 left-0 z-[100] overflow-auto"
			onKeyDown={handleKeypress}
		>
			<label htmlFor="list-title">Title:</label>
			<input
				type="text"
				id="list-title"
				className="p-2"
				onChange={(e) => setTitle(e.target.value)}
				onKeydown={handleKeypress}
			/>
			<input
				type="button"
				className="p-4 bg-black text-white rounded-full"
				onClick={submit}
				value="Submit"
			/>
		</form>
	);
}
