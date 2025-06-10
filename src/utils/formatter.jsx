export function formatCurrency(value, currencyCode = "usd") {
  const currencyMap = {
    usd: "en-US",
    eur: "de-DE",
    gbp: "en-GB",
    jpy: "ja-JP",
    pln: "pl-PL",
  };
  const locale = currencyMap[currencyCode.toLowerCase()] || "en-US";
  const hasFraction = value % 1 !== 0;
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode.toLowerCase(),
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}
