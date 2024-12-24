import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

const CartModal = ({ show, onClose, items, onRemove, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [quantities, setQuantities] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const total = items?.reduce((sum, item) => sum + item.price * (quantities[item.id] || 1), 0) || 0;

  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, newQuantity) })); // Ensure quantity is at least 1
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
  
    try {
      const orderData = {
        client_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        total: total,
        items: items.map(item => ({
          shoe: item.backendId, // Use backend ID here
          variant: item.variantId, 
          size: item.selectedSize, 
          quantity: quantities[item.backendId] || 1, // Ensure quantity keys align
        })),
      };
  
      const response = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const result = await response.json();
        onOrderComplete();
        onClose();
        alert(`Order successful! Order ID: ${result.id}`);
      } else {
        throw new Error('Failed to submit order.');
      }
    } catch (error) {
      setSubmitError('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!items?.length ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="mb-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                      <div className="flex items-center gap-2">
                        <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                        <input
                          type="number"
                          id={`quantity-${item.id}`}
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-4 text-right">
                <p className="font-bold">Total: ${total.toFixed(2)}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              {submitError && <p className="text-red-500">{submitError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;