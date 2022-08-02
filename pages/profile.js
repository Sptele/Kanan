import Link from "next/link";
import Layout from "../components/Layout";
import ProfilePicture from "../components/ProfilePicture";
import { getMember } from "../db/member";
import { createMember } from "../util/creation-factory";
import { useState } from "react";
import { getAllBoards } from "../db/board";
import Loading from "../components/Loading";
import useSWR, { SWRConfig } from "swr";
import fetcher from "../util/fetcher";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";

function CreateMember({ setShown, currMember }) {
	const [data, setData] = useState(currMember);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!isSubmitting) return;

		const runner = async () => {
			await fetch("/api/member", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: { _id: data._id },
					replacement: data,
				}),
			});

			router.reload("/profile");
		};

		runner();

		setShown(false);
	}, [isSubmitting]);

	return (
		<div className="flex flex-col gap-4 p-4 text-center mr-4">
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl">Edit your profile...</h1>
				<form>
					<div className="flex flex-col gap-4">
						<label className="text-sm">Name</label>
						<input
							className="w-full p-2 rounded-lg"
							type="text"
							value={data.name}
							onChange={(e) => {
								setData(
									createMember(
										e.target.value,
										data.email,
										data.biography,
										data.role,
										data.isSignedIn,
										data._id
									)
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<label className="text-sm">Email</label>
						<input
							className="w-full p-2 rounded-lg"
							type="email"
							value={data.email}
							onChange={(e) => {
								setData(
									createMember(
										data.name,
										e.target.value,
										data.biography,
										data.role,
										data.isSignedIn,
										data._id
									)
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<label className="text-sm">Role</label>
						<input
							className="w-full p-2 rounded-lg"
							type="text"
							value={data.role}
							onChange={(e) => {
								setData(
									createMember(
										data.name,
										data.email,
										data.biography,
										e.target.value,
										data.isSignedIn,
										data._id
									)
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<label className="text-sm">Biography</label>
						<textarea
							className="w-full p-2 rounded-lg"
							value={data.biography}
							rows="7"
							col="50"
							onChange={(e) => {
								setData(
									createMember(
										data.name,
										data.email,
										e.target.value,
										data.role,
										data.isSignedIn,
										data._id
									)
								);
							}}
						/>
					</div>
					<div className="flex content-center">
						<input
							type="button"
							value="Cancel"
							className="bg-red text-white p-4 rounded-full m-auto"
							onClick={() => setShown(false)}
						/>
						<div className="flex flex-col m-auto mt-2">
							<input
								type="button"
								value="Edit"
								className={
									"bg-black text-white p-4 rounded-full"
								}
								onClick={() => setIsSubmitting(!isSubmitting)}
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

function MemberShow({ member }) {
	return (
		<div className="flex flex-col justify-center items-center gap-4 mt-8">
			<p className="text-xs text-slate-500 text-center m-auto w-36">
				{member.role.toUpperCase()}
			</p>
			<ProfilePicture
				name={member.name}
				className="w-36 h-36 text-8xl leading-[9rem] self-center m-0"
			/>
			<h2>{member.name}</h2>
			<Link href={"mailto:" + member.email}>
				<a className="text-black underline" target="_blank">
					<h4>{member.email}</h4>
				</a>
			</Link>
			<p className="w-80">{member.biography}</p>
		</div>
	);
}

function ClosedBoard({ board, isDeleting, showLoader }) {
	const [meDelete, setMeDelete] = useState(false);

	useEffect(() => {
		if (!isDeleting) return;
		if (!meDelete) return;

		const confirmed = prompt(
			`Are you sure you want to delete this board? Type"${board.title}" to confirm.`
		);

		if (!confirmed) {
			setMeDelete(false);
			return;
		}

		const runner = async () => {
			await fetch("/api/board", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: board._id }),
			});
		};

		runner();
	}, [isDeleting, meDelete, board]);
	return (
		<>
			{isDeleting ? (
				<button
					className={
						"p-2 w-full bg-yellow text-black rounded-xl text-center hover-red"
					}
					onClick={() => setMeDelete(!meDelete)}
				>
					{board.title}
				</button>
			) : (
				<Link href={`/boards/${board._id}`}>
					<a
						className={
							"p-2 w-full bg-yellow text-black rounded-xl text-center"
						}
						onClick={() => showLoader(true)}
					>
						{board.title}
					</a>
				</Link>
			)}
		</>
	);
}

function Profile() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const { data: member } = useSWR("/api/member-signed/", fetcher);
	const { data: boards } = useSWR("/api/boards/", fetcher);

	if (!member || !boards) {
		return <h1>Unable to connect to Database. Try again...</h1>;
	}

	if (isOpen) {
		return <CreateMember setShown={setIsOpen} currMember={member} />;
	}

	return (
		<>
			{isLoading && <Loading text={"Redirecting..."} />}
			<Layout
				title="Profile"
				description="Your Profile Page, where you can find and update your information as well as your boards."
			>
				<div className="grid grid-cols-2 grid-rows-1 gap-4">
					<div className="flex flex-col gap-4 text-center">
						<div className={!member ? "hidden" : undefined}>
							<MemberShow member={member} />
						</div>
						<button
							className="p-2 text-black bg-white rounded-full w-40 mx-auto"
							onClick={() => setIsOpen(!isOpen)}
						>
							Edit Profile
						</button>
					</div>
					<div className="bg-white flex flex-col gap-2 rounded-xl min-h-full p-4">
						<div className={"flex flex-row"}>
							<h2 className="text-left text-black">
								Your Boards
							</h2>
							<button
								onClick={() => setIsDeleting(!isDeleting)}
								className={
									"ml-auto mr-0 float-right no-higlight" +
									(isDeleting ? " shake" : "")
								}
							>
								<Image
									src={"/trash-closed.svg"}
									width={48}
									height={48}
								/>
							</button>
						</div>
						<div className="overflow-y-auto flex flex-col min-h-[75vh] gap-2">
							<Link href="/boards/new">
								<a className="p-1 w-full bg-black text-white rounded-xl text-center">
									Create a new board...
								</a>
							</Link>
							<div className="grid grid-rows-6 grid-cols-3 gap-2">
								{boards.map((board) => {
									return (
										<ClosedBoard
											key={board._id}
											board={board}
											isDeleting={isDeleting}
											showLoader={setIsLoading}
										/>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
}

export default function Page({ fallback }) {
	return (
		<SWRConfig value={{ fallback }}>
			<Profile />
		</SWRConfig>
	);
}

export async function getStaticProps() {
	const member = await getMember({ isSignedIn: true });
	const boards = await getAllBoards();

	return {
		props: {
			fallback: {
				"/api/member-signed/": member,
				"/api/boards/": boards,
			},
		},
	};
}
