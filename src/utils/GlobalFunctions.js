function formatAmount(amount) {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
    
    return `₹ ${formatted}`; // Note the space after ₹
  }

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for "08 Aug" format
};

export { formatAmount,formatDate };