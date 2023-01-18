export function GetFormattedCurrency(currency) {
    let formatCurrency = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'VND'
    });

    let money = formatCurrency.format(currency);
    return money;
}