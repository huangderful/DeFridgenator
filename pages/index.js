import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ImageUpload from './component/image-upload'
import NavBar from './component/NavBar';
const Index = () => {
  return (
    <div className="bg-gradient-to-b from-emerald-200 bg-teal-200  to-teal-400 min-h-screen bg-fixed">

      <Head>
        <title>DeFridgenator</title>
        <link rel="icon" href="/fridge.png" />
      </Head>
      <NavBar />

      <main className="flex justify-center mt-10 items-center">
        <ImageUpload />
      </main>
    </div>
  );
};

export default Index;

