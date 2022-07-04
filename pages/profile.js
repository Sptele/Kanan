import Link from "next/link";
import Layout from "../components/Layout";
import ProfilePicture from "../components/ProfilePicture";
import { getAllMembers } from "../db/member";
import { createMember } from "../util/creation-factory";
import { useState } from "react";
import { getAllBoards } from "../db/board";
import Loading from "../components/Loading";
import useSWR, { SWRConfig } from "swr";
import fetcher from "../util/fetcher";

function CreateMember({ setShown, allMembers }) {
	const [data, setData] = useState(createMember("", "", "", "", true));

	// TODO: create support for multiple profiles

	const submit = () => {
		const runner = async () => {
			await fetch("/api/member", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
		};

		runner();

		allMembers.push(data);
		setShown(false);
	};

	return (
		<div className='flex flex-col gap-4 p-4 text-center mr-4'>
			<div className='flex flex-col gap-4'>
				<h1 className='text-2xl'>Add a new member...</h1>
				<form>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Name</label>
						<input
							className='w-full p-2 rounded-lg'
							type='text'
							placeholder='John Doe'
							onChange={(e) => {
								setData(
									createMember(
										e.target.value,
										data.email,
										data.biography,
										data.role,
										data.isSignedIn
									)
								);
							}}
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Email</label>
						<input
							className='w-full p-2 rounded-lg'
							type='email'
							placeholder='john.doe@email.com'
							onChange={(e) => {
								setData(
									createMember(
										data.name,
										e.target.value,
										data.biography,
										data.role,
										data.isSignedIn
									)
								);
							}}
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Role</label>
						<input
							className='w-full p-2 rounded-lg'
							type='text'
							placeholder='Admin'
							onChange={(e) => {
								setData(
									createMember(
										data.name,
										data.email,
										data.biography,
										e.target.value,
										data.isSignedIn
									)
								);
							}}
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Biography</label>
						<textarea
							className='w-full p-2 rounded-lg'
							placeholder='My biography'
							rows='7'
							col='50'
							onChange={(e) => {
								setData(
									createMember(
										data.name,
										data.email,
										e.target.value,
										data.role,
										data.isSignedIn
									)
								);
							}}
						/>
					</div>
					<div className='flex content-center'>
						<input
							type='button'
							value='Cancel'
							className='bg-red text-white p-4 rounded-full m-auto'
							onClick={() => setShown(false)}
						/>
						<div className='flex flex-col m-auto mt-2'>
							<input
								type='button'
								value='Create'
								className={
									"bg-black text-white p-4 rounded-full"
								}
								onClick={submit}
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
			<p className='text-xs text-slate-500 text-center m-auto w-36'>
				{member.role.toUpperCase()}
			</p>
			<ProfilePicture
				name={member.name}
				className='w-36 h-36 text-8xl leading-[9rem] self-center m-0'
			/>
			<h2>{member.name}</h2>
			<Link href={"mailto:" + member.email}>
				<a className='text-black underline'>
					<h4>{member.email}</h4>
				</a>
			</Link>
			<p className='w-80'>{member.biography}</p>
		</div>
	);
}

function ClosedBoard({ board, showLoader }) {
	return (
		<Link href={`/boards/${board._id}`}>
			<a
				className='p-2 w-full bg-yellow text-black rounded-xl'
				onClick={() => showLoader(true)}>
				{board.title}
			</a>
		</Link>
	);
}

function Profile() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { data: all } = useSWR("/api/members/", fetcher);
	const { data: boards } = useSWR("/api/boards/", fetcher);

	const member = all.find((member) => member.isSignedIn);

	if (isOpen) {
		return (
			<CreateMember
				setShown={setIsOpen}
				allMembers={all}
			/>
		);
	}

	return (
		<>
			{isLoading && <Loading text={"Redirecting..."} />}
			<Layout
				title='Profile'
				description='Your Profile Page, where you can find and update your information as well as your boards.'>
				<div className='grid grid-cols-2 grid-rows-1 gap-4'>
					<div className='flex flex-col gap-4 text-center'>
						{member && <MemberShow member={member} />}
						<button
							className='p-2 text-black bg-white rounded-full w-40 m-auto'
							onClick={() => setIsOpen(!isOpen)}>
							Create New Profile
						</button>
					</div>
					<div className='bg-white flex flex-col gap-2 rounded-xl min-h-full'>
						<h2 className='text-left text-black m-4'>
							Your Boards
						</h2>
						<div className='overflow-y-auto flex flex-col min-h-[75vh] gap-2 p-2'>
							<Link href='/boards/new'>
								<a className='p-1 w-full bg-black text-white rounded-xl text-center'>
									Create a new board...
								</a>
							</Link>
							{boards.map((board) => {
								return (
									<ClosedBoard
										key={board._id}
										board={board}
										showLoader={setIsLoading}
									/>
								);
							})}
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
	const all = await getAllMembers();
	const boards = await getAllBoards();

	return {
		props: {
			fallback: {
				"/api/members/": all,
				"/api/boards/": boards,
			},
		},
	};
}
