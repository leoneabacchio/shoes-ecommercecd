import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../components/Card';

const HomePage = ({ searchQuery, addToCart, products }) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const firstImage =
            product.variants.length > 0
              ? product.variants[0].image
              : 'https://picsum.photos/2';

          return (
            <Card
              key={product.id}
              className="bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30 rounded-xl shadow-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-200"
            >
              <Link to={`/product/${product.id}`}>
                <div className="bg-gradient-to-br from-gray-800 to-black p-4">
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </Link>
              <CardContent className="p-6 space-y-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold text-white hover:text-yellow-500 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-2xl font-semibold text-yellow-500">${product.price}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-2 flex gap-4">
                <Link to={`/product/${product.id}`}>
                  <button
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold
                              hover:bg-blue-600 transition-all duration-200 text-center"
                  >
                          Buy it Now !
                        </button>
                  </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;