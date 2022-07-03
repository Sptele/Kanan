import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { createBoard } from "../../util/creation-factory";
import randId from "../../util/random-id";
import { useRouter } from "next/router";
import Image from "next/image";

export default function New() {
	const router = useRouter();

	const id = randId();
	const [data, setData] = useState(createBoard("", id));
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isSubmitting) return;

		const runner = async () => {
			fetch("/api/board", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
		};

		runner();

		router.push("/boards/" + data._id);
	}, [isSubmitting, data, router]);

	return (
		<Layout
			title='New Board'
			description={"Create a new board"}>
			<div className='grid grid-cols-2 grid-rows-1 gap-4'>
				<div className='text-center'>
					<h2>Create a new board...</h2>
					<form>
						<input
							type='text'
							className='p-2'
							onChange={(e) => {
								setData(createBoard(e.target.value, id));
							}}
						/>
						<input
							type='button'
							value={isSubmitting ? "Created!" : "Create"}
							className='bg-white p-4 rounded-full text-black'
							onClick={() => setIsSubmitting(true)}
						/>
					</form>
					{isSubmitting && (
						<div className="flex flex-row gap-2 justify-center">
							<Image src="/loading.svg" width="16" height="16" alt={"A spinning gear to signify loading."} />
							<h6 className='text-xs text-red'>
								Redirecting...
							</h6>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}
