const formatAmount = (amount) => {
    const amountStr = `${amount}`;
    const [integerPart, decimalPart] = amountStr.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    return `₹${formattedAmount}`;
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for "08 Aug" format
};

export { formatAmount,formatDate };