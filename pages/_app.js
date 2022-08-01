import "../styles/globals.css";

function MyApp({ Component, pageProps }) {

	return (
		<Component {...pageProps} />
	);
}

// TODO: switch to client side rendering since its faster and we don't care about SEO

export default MyApp;
