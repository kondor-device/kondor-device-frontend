export const formatSum = (value: number): string => {
  return new Intl.NumberFormat("uk-UA", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u00A0/g, " ");
};
