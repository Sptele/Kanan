import { useEffect, useState } from "react";
import { createList } from "../../util/creation-factory";
import randId from "../../util/random-id";

export default function ListCreator({ lists, boardId, setShown }) {
	const id = randId();
	const [data, setData] = useState(createList("", boardId, [], id));
	const [hasSubmitted, setHasSubmitted] = useState(false);

	useEffect(() => {

		if (!hasSubmitted) return;

		const runner = async () => {
			fetch("/api/list", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
		};

		runner();

		setHasSubmitted(false);


		lists.push(data);
		setShown(false);
	}, [hasSubmitted]);

	const submit = () => {
		setHasSubmitted(true);
	};

	const handleKeypress = (e) => {
		if (e.key === "Escape") setShown(false);
		if (e.key === "Enter") submit();
	};

	return (
		<form
			className='p-4 fixed bg-white w-full h-full top-0 left-0 z-[100] overflow-auto'
			onKeyDown={handleKeypress}>
			<label htmlFor='list-title'>Title:</label>
			<input
				type='text'
				id='list-title'
				className='p-2'
				onChange={(e) =>
					setData(createList(e.target.value, boardId, [], id))
				}
				onKeyDown={handleKeypress}
			/>
			<input
				type='button'
				className='p-4 bg-black text-white rounded-full'
				onClick={submit}
				value='Submit'
			/>
		</form>
	);
}
