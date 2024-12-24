import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

const Navbar = ({ cartCount, onCartClick, onSearch }) => {
  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          ShoesStore
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border rounded-lg w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          
          <button 
            onClick={onCartClick}
            className="relative p-2"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;