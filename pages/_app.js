// pages/_app.js
import '../styles/global.css'; // Global CSS import here

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;