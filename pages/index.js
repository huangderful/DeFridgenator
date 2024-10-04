import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ImageUpload from './component/image-upload'
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>DeFridgenator</title>
        <link rel="icon" href="/fridge.png" />
      </Head>

      <main>
        <ImageUpload> </ImageUpload>
      </main>
    </div>

  );
}
