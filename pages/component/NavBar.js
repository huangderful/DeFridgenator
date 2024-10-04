import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
        
      <div className="container mx-auto flex justify-between items-center">

      <div className="flex items-center text-white font-bold text-xl">
        <Link href="/" className="flex items-center">
            <div>DeFrigenator</div>
            <img src="./fridge.png" alt="DeFrigenator Logo" className="h-10 w-10 ml-2" />
        </Link>
        </div>

        <ul className="flex space-x-6">
          <li>
            
          </li>
          <li>
            <Link href="/about" className="text-gray-300 hover:text-white">
              About
            </Link>
          </li>
          <li>
            
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
