const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async submitOrder(orderData) {
    // Simulate API call delay
    await delay(1000);
    console.log('Order submitted to API:', orderData);
    return {
      success: true,
      orderId: Math.random().toString(36).substring(7),
    };
  },

  async getProductImages(productId) {
    // Simulate API call delay
    await delay(500);
    // Mock product images for different colors
    const images = {
      Black: "/api/placeholder/400/400?text=Black+Shoes",
      White: "/api/placeholder/400/400?text=White+Shoes",
      Red: "/api/placeholder/400/400?text=Red+Shoes",
    };
    return images;
  }
};


