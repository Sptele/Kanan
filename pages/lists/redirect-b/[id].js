import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { getList, getAllLists } from "../../../db/list";
import fetcher from "../../../util/fetcher";

export default function Redirect({ boardId }) {
	const router = useRouter();

	useEffect(() => {
		router.push(`/boards/${boardId}`);
	});

	return <div>Redirecting to /boards/{boardId}...</div>;
}

export async function getStaticPaths() {
	const lists = await getAllLists();
	const paths = lists.map((obj) => ({
		params: { id: obj._id },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const list = await getList({ _id: params.id });

	return {
		props: {
			boardId: list.boardId
		},
	};
}
