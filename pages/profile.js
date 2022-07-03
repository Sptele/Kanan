import Link from "next/link";
import Layout from "../components/Layout";
import ProfilePicture from "../components/ProfilePicture";
import { getAllMembers } from "../db/member";
import { createMember } from "../util/creation-factory";
import { useState } from "react";

function CreateMember({ setShown }) {
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
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Email</label>
						<input
							className='w-full p-2 rounded-lg'
							type='email'
							placeholder='john.doe@email.com'
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Role</label>
						<input
							className='w-full p-2 rounded-lg'
							type='text'
							placeholder='Admin'
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label className='text-sm'>Biography</label>
						<textarea
							className='w-full p-2 rounded-lg'
							placeholder='My biography'
							rows='7'
							col='50'
						/>
					</div>
					
				</form>
			</div>
		</div>
	);
}

function MemberShow({ member }) {
	return (
		<>
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
			<p className='w-80 m-auto'>{member.biography}</p>
		</>
	);
}

export default function Profile({ member }) {
	const [isOpen, setIsOpen] = useState(false);

	if (isOpen) {
		return <CreateMember setShown={setIsOpen} />;
	}

	return (
		<Layout
			title='Profile'
			description='Your Profile Page, where you can find and update your information as well as your boards.'>
			<div className='grid grid-cols-2 grid-rows-1 gap-4'>
				<div className='flex flex-col gap-4 text-center'>
					{member !== null && <MemberShow member={member} />}
					<button className="p-2 text-black bg-white rounded-full w-6" onClick={() => setIsOpen(!isOpen)}>+</button>
				</div>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const all = await getAllMembers();

	if (!all || all.length === 0) {
		return {
			props: {
				member: null,
			},
		};
	}

	const member = all.filter((member) => member.isSignedIn)[0];

	return {
		props: {
			member: member ? member : null,
		},
	};
}
