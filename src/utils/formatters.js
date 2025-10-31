// Currency and number formatters
const currencyFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount).replace('ZAR', 'R')
}

export function formatNumber(num, minimumFractionDigits = 0) {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(num)
}
