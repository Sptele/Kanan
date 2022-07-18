import { UserContext } from "../util/member-context";
import { createMember } from "../util/creation-factory";
import { useEffect } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const runner = async () => {
			await fetch("/api/member", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(),
			})
		}
	})
	const currMember = createMember("John Doe", "johns@email.com", "A user", "Team Manager");

	return (
		<UserContext.Provider value={currMember}>
			<Component {...pageProps} />
		</UserContext.Provider>
	);
}

// TODO: switch to client side rendering since its faster and we don't care about SEO

export default MyApp;
