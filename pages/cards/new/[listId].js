import CardCreator from "../../../components/creators/CardCreator";
import PageMeta from "../../../components/PageMeta";
import { getAllLists } from "../../../db/list";

export default function New({ listId }) {
	return (
		<>
			<PageMeta title="New Card" description="Create a new card" />
			<CardCreator listId={listId} />
		</>
	);
}

export async function getStaticPaths() {
	const lists = await getAllLists();
	const paths = lists.map((obj) => ({
		params: { listId: obj._id },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	return {
		props: {
			listId: params.listId,
		},
	};
}
