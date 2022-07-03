import { UserContext } from "../util/member-context";
import { createMember } from "../util/creation-factory";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	const currMember = createMember("John Doe", "johns@email.com", "A user", "Team Manager");

	return (
		<UserContext.Provider value={currMember}>
			<Component {...pageProps} />
		</UserContext.Provider>
	);
}

export default MyApp;
