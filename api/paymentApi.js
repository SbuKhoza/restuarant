const paymentApi = {
    verifyTransaction: async (reference) => {
      try {
        const response = await fetch(`https://restaurent-cms.onrender.com/api/verify-payment/${reference}`);
        return await response.json();
      } catch (error) {
        throw error;
      }
    }
  };
  
  export default paymentApi;