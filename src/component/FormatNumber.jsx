export function formatNumberInput(value) {

    const numericValue = value.replace(/,/g, "");

    if (/^\d*\.?\d*$/.test(numericValue)) {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(parseFloat(numericValue) || 0);
    }

    return value;
}

// String
export function formatNumber(number) {
    if (number === undefined || number === null) return "0.00";
    return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number)
    
}


export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";

    const number = Number(amount);
    const formattedNumber = number
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
  };


export const formatNumberWithSign = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    if (num > 0) {
        return "+" + num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};