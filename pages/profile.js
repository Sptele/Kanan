import Link from "next/link";
import Layout from "../components/Layout";
import ProfilePicture from "../components/ProfilePicture";
import { createMember } from "../util/creation-factory";

export default function Profile({ member }) {
	return (
		<Layout
			title='Profile'
			description='Your Profile Page, where you can find and update your information as well as your boards.'>
			<div className='grid grid-cols-2 grid-rows-1 gap-4'>
				<div className='flex flex-col gap-4 text-center'>
					<p className="text-xs text-slate-500 text-center m-auto w-36">{member.role.toUpperCase()}</p>
					<ProfilePicture
						name={member.name}
						className='w-36 h-36 text-8xl leading-[9rem] self-center m-0 ml-0'
					/>
					<h2>{member.name}</h2>
					<Link href={'mailto:' + member.email}>
						<a className="text-black underline">
							<h4>{member.email}</h4>
						</a>
					</Link>
					<p className="w-80 m-auto">{member.biography}</p>
				</div>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	return {
		props: {
			member: createMember(
				"John Doe",
				"john.doe@email.com",
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				"Team Manager"
			),
		},
	};
}
