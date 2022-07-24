import randId from "../util/random-id";
import { createList } from "../util/creation-factory";
import Loading from "../components/Loading";
import CardSkeleton from "../components/skeletons/CardSkeleton";
import DragController from "../components/drag-controller";
import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";

const Draggable = ({ pos, setIsMouseDown }) => {
	const dragRef = useRef(null);

	const [isMouseDown, setIsMouseDown] = useState(false);

	const moveBox = () => {
		dragRef.current.style.left =
			pos[0] + dragRef.current.style.width / 2 + "px";
		dragRef.current.style.top =
			pos[1] + dragRef.current.style.height / 2 + "px";
	};

	return (
		<div
			ref={dragRef}
			className='border-2 border-black inline p-2 absolute w-20'
			onMouseDown={() => {
				setIsMouseDown(true);
				moveBox();
			}}
			onMouseUp={() => setIsMouseDown(false)}>
			My Drag
		</div>
	);
};

export default function Home() {
	const [pos, setPos] = useState([0, 0]);
	const [isMouseDown, setIsMouseDown] = useState(false);

	const logPos = (event) => {
		setPos([event.clientX, event.clientY]);
	};

	return (
		<div
			className='min-h-screen'
			onMouseMove={logPos}
			onMouseUp={() => setIsMouseDown(false)}>
			<div className='min-h-[50vh]'>
				<Draggable
					pos={pos}
					setIsMouseDown={setIsMouseDown}
				/>
			</div>
		</div>
	);
}
