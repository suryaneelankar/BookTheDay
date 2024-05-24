const formatAmount = (amount) => {
    const amountStr = `${amount}`;
    const [integerPart, decimalPart] = amountStr.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    return `₹${formattedAmount}`;
}



export { formatAmount };