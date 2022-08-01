import Link from "next/link";
import Layout from "../components/Layout";

export default function Error() {
	return (
		<Layout title="Error 404" description="Error">
			<div>
				<div className="absolute top-1/2 text-center">
					<h2 className="text-center inline">
						<strong>404</strong> | Unable to route to your requested
						page |{" "}
					</h2>
					<Link href="/profile">
						<a className="mt-4 text-center inline">
							<h2 className="inline">Return to your profile</h2>
						</a>
					</Link>
				</div>
			</div>
		</Layout>
	);
}

export function getStaticProps() {
	return {
		props: {}
	}
}