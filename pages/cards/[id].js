import { OpenedCard } from "../../components/card";
import { getCard, getAllCards } from "../../db/card";
import { getAllLists, getList } from "../../db/list";

export default function DisplayCard({ data, cardList, index, lists }) {
	return (
		<OpenedCard
			data={data}
			cardList={cardList}
			index={index}
			lists={lists}
		/>
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
	const cardList = await getList({ _id: data.listId });
	const index = cardList.cards.findIndex((card) => card._id === data._id);

	return {
		props: {
			data,
			cardList,
			index,
			lists: await getAllLists(),
		},
	};
}
