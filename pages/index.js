import { getAllLists, insertList } from "../util/mongodb"
import randId from "../util/random-id";
import { createList } from "../util/creation-factory";

export default function Home({ names }) {
	return (
		<>
		<ol>
			{names.map((obj, i) => {
				return <li key={obj._id}>{obj.title}</li>
			})}	
		</ol>
		</>
	)
}

export async function getStaticProps() {
	await insertList(createList("My List", randId(), []));

	const names = await getAllLists();
	return {
		props: {
			names,
			
		}
	}
}