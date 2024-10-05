//here to show that I know how paages work
import Head from 'next/head';
import NavBar from './component/NavBar';
const About = () => {
  return (
    <div className="bg-gradient-to-b from-emerald-200 bg-teal-200  to-teal-400 min-h-screen bg-fixed">

      <Head>
        <title>DeFridgenator</title>
        <link rel="icon" href="/fridge.png" />
      </Head>
      <NavBar />

      <main className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-gray-900 font-bold text-xl mb-4">
            EatCookJoy Assessment Oct. '24
          </h2>
          <h2 className="text-gray-900 font-bold text-xl mb-4">
            Created by Richard Huang
          </h2>
        </div>
      </main>



    </div>
  );
};

export default About;

