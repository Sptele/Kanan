import { DateTimePicker } from "react-rainbow-components";
import { CallbackContext } from "../pages/board";
import { useContext } from "react";

export function TitleUpdater({ data, setShown }) {
	return (
		<div className="bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[25rem] border-y-2 border-y-black">
			<label htmlFor="title-updater" className="text-white">
				New title:
			</label>
			<input
				type="text"
				id="title-updater"
				onChange={(e) => (data.title = e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") setShown(false);
				}}
			/>
			<input
				type="button"
				className="bg-white text-black p-2 rounded-xl"
				onClick={() => setShown(false)}
				value="Close"
			/>
		</div>
	);
}

export function DescriptionUpdater({ data, setShown }) {
	return (
		<div className="bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[10rem] border-y-2 border-y-black">
			<label htmlFor="desc-updater" className="text-white">
				New Description:
			</label>
			<br />
			<textarea
				type="text"
				id="desc-updater"
				rows="10"
				cols="50"
				onChange={(e) => (data.description = e.target.value)}
			/>
			<br />

			<input
				type="button"
				className="bg-white text-black p-2 rounded-xl mt-2"
				onClick={() => setShown(false)}
				value="Close"
			/>
		</div>
	);
}

export function DueDateUpdater({ data, setShown }) {
	return (
		<div className="bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[18rem] border-y-2 border-y-black">
			<label htmlFor="due-date-updater" className="text-white">
				New Due Date:
			</label>
			<br />
			<DateTimePicker
				id="due-date-updater"
				value={data.dueDate.toLocaleString()}
				onChange={(value) => (data.dueDate = value)}
				formatStyle="large"
				locale={"en-US"}
				okLabel={"OK"}
				cancelLabel={"CANCEL"}
			/>
			<br />

			<input
				type="button"
				className="bg-white text-black p-2 rounded-xl mt-2"
				onClick={() => setShown(false)}
				value="Close"
			/>
		</div>
	);
}

export function ListUpdater({ data, lists, setShown }) {
	const forceUpdate = useContext(CallbackContext);

	return (
		<div className="bg-red p-4 fixed bottom-0 left-0 w-full z-50 mb-[18rem] border-y-2 border-y-black">
			<label htmlFor="list-updater" className="text-white">
				New List:
			</label>
			<div
				id="list-updater"
				className="grid grid-cols-6 grid-rows-6 gap-1"
			>
				{lists.map((list) => {
					return (
						<button
							className={
								"text-black p-2 rounded-xl " +
								(list.id === data.listId
									? "bg-yellow"
									: "bg-white")
							}
							key={list.id}
							onClick={() => {
								if (list.id === data.listId) return;

								list.cards.push(data);
								lists.forEach((eList) => {
									if (eList.id === data.listId)
										eList.cards.splice(
											eList.cards.indexOf(data),
											1
										);
								});
								data.listId = list.id;
								forceUpdate();
								setShown(false);
							}}
						>
							{list.title.length > 8
								? `${list.title.substring(0, 8)}...`
								: list.title}
						</button>
					);
				})}
			</div>

			<input
				type="button"
				className="bg-white text-black p-2 rounded-xl mt-2"
				onClick={() => setShown(false)}
				value="Close"
			/>
		</div>
	);
}
