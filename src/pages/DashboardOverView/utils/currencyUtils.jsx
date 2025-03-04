export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0';
    const number = Number(amount);
    const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
        <>
            <sup style={{ fontSize: '0.6em' }}>฿</sup>{formattedNumber}
        </>
    );
};

export const formatCurrencyNoDollars = (amount) => {
    if (amount === undefined || amount === null) return '0';
    const number = Number(amount);
    const formattedNumber = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedNumber}`;
};

export const formatCurrencyNoDollarsWithFixed = (amount) => {
    if (amount === undefined || amount === null) return '0';
    const number = Number(amount);
    const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedNumber}`;
};

export const formatCurrencyNoDollars2Fixed = (amount) => {
    if (amount === undefined || amount === null) return '0';

    const number = Number(amount);
    const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
};