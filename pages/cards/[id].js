import { OpenedCard } from "../../components/card";
import { getCard, getAllCards } from "../../db/card";
import { getAllLists } from "../../db/list";
import { SWRConfig } from "swr";
import PageMeta from "../../components/PageMeta";


export default function Page({ fallback }) {
	return (
		<SWRConfig value={{ fallback }}>
			<OpenedCard />
		</SWRConfig>
	);
}

export async function getStaticPaths() {
	const cards = await getAllCards();
	const paths = cards.map((obj) => ({
		params: { id: obj._id },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const data = await getCard({ _id: params.id });
	const allLists = await getAllLists();
	const cardList = allLists.filter((list) => list._id === data.listId)[0];
	const index = cardList.cards.findIndex((card) => card._id === data._id);

	return {
		props: {
			fallback: {
				"/api/data/": data,
				"/api/cardList/": cardList,
				"/api/index/": index,
				"/api/lists/": allLists,
			},
		},
	};
}
