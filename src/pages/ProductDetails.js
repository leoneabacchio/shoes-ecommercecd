import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../components/Card';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    size: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/shoes/${id}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product with ID ${id}.`);
        }
        const data = await response.json();
        setProduct(data);

        if (data.variants.length > 0) {
          const firstVariant = data.variants[0];
          setSelectedColor(firstVariant.color);
          setCurrentImage(firstVariant.image);
          const defaultSize = firstVariant.sizes.split(',')[0].trim();
          setSelectedSize(defaultSize);
          setFormData((prev) => ({ ...prev, size: defaultSize }));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const selectedVariant = product.variants.find(variant => variant.color === color);
    if (selectedVariant) {
      setCurrentImage(selectedVariant.image);
      const defaultSize = selectedVariant.sizes.split(',')[0].trim();
      setSelectedSize(defaultSize);
      setFormData((prev) => ({ ...prev, size: defaultSize }));
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const orderData = {
        client_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        total: product.price,
        items: [
          {
            shoe: product.id,
            variant: product.variants.find(variant => variant.color === selectedColor)?.id,
            size: selectedSize,
            quantity: 1
          }
        ]
      };

      const response = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Order successful! Order ID: ${result.id}`);
        setShowOrderForm(false);
      } else {
        throw new Error('Failed to submit order.');
      }
    } catch (error) {
      setSubmitError('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return <div className="text-white text-center py-10">Loading product details...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-5xl mx-auto bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <div
              className="bg-gradient-to-br from-gray-800 to-black p-4 rounded-lg border border-yellow-500/20"
              style={{ width: '400px', height: '400px' }}
            >
              <img
                src={currentImage || '/api/placeholder/400/400'}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <CardContent className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-3xl font-semibold text-yellow-500">${product.price}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-500/80">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants
                  .find(variant => variant.color === selectedColor)
                  ?.sizes.split(',')
                  .map(size => size.trim())
                  .map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`px-6 py-3 rounded-lg border transition-all duration-200
                        ${selectedSize === size
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                          : 'border-gray-700 text-gray-300 hover:border-yellow-500/50 hover:bg-yellow-500/5'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-500/80">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map(variant => (
                  <button
                    key={variant.color}
                    onClick={() => handleColorChange(variant.color)}
                    className={`px-6 py-3 rounded-lg border transition-all duration-200
                      ${selectedColor === variant.color
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                        : 'border-gray-700 text-gray-300 hover:border-yellow-500/50 hover:bg-yellow-500/5'
                      }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="col-span-1 md:col-span-2 flex gap-4 pt-6">
            <button
              onClick={() => setShowOrderForm(true)}
              className="flex-1 bg-green-500 text-white px-8 py-4 rounded-lg font-semibold
                         hover:bg-green-600 transition-all duration-200"
            >
              Buy Now
            </button>
            <button
              onClick={() => {
                const productWithOptions = {
                  ...product,
                  backendId: product.id,
                  selectedColor,
                  selectedSize,
                  variantId: product.variants.find(variant => variant.color === selectedColor)?.id,
                  image: currentImage,
                };
                addToCart(productWithOptions);
              }}
              className="flex-1 bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold
                         hover:bg-blue-600 transition-all duration-200"
            >
              Add to Cart
            </button>
          </CardFooter>
        </div>
      </Card>

      {showOrderForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg w-full max-w-2xl border border-yellow-500/50 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Complete Your Order</h2>
            <form
              onSubmit={handleBuyNow}
              className="space-y-6"
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-500/80">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-500/30 text-white 
                             focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all
                             placeholder-gray-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-500/80">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-500/30 text-white 
                             focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all
                             placeholder-gray-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-500/80">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-500/30 text-white 
                             focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all
                             placeholder-gray-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-500/80">Selected Size</label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-yellow-500/30 text-white placeholder-gray-500"
                  value={formData.size}
                />
              </div>
              {submitError && <p className="text-red-500">{submitError}</p>}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 px-6 py-3 rounded-lg border border-yellow-500/30 text-yellow-500
                             hover:bg-yellow-500/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold
                             hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 
                             transition-all duration-200"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
