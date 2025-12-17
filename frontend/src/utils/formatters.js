// Number and date formatting utilities

/**
 * Format number with commas and decimals
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage with % sign
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return `${formatNumber(value, decimals)}%`
}

/**
 * Format currency in Korean Won
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '-'

  // Handle large numbers with 만, 억
  if (value >= 100000000) {
    return `${formatNumber(value / 100000000, 1)}억원`
  } else if (value >= 10000) {
    return `${formatNumber(value / 10000, 1)}만원`
  }
  return `${formatNumber(value)}원`
}

/**
 * Format date
 * @param {Date|string} date - The date to format
 * @param {string} format - Format type: 'short', 'medium', 'long' (default: 'medium')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '-'

  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  switch (format) {
    case 'short':
      return `${month}-${day}`
    case 'long':
      return `${year}년 ${month}월 ${day}일`
    case 'medium':
    default:
      return `${year}-${month}-${day}`
  }
}

/**
 * Format time difference from now
 * @param {Date|string} date - The date to compare
 * @returns {string} Relative time string (e.g., "2시간 전")
 */
export const formatTimeAgo = (date) => {
  if (!date) return '-'

  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`

  return formatDate(d, 'medium')
}

/**
 * Format change value with arrow
 * @param {number} value - The change value
 * @param {boolean} isPercent - Whether to show as percentage (default: false)
 * @returns {object} { text: string, type: 'positive'|'negative'|'neutral' }
 */
export const formatChange = (value, isPercent = false) => {
  if (value === null || value === undefined || isNaN(value)) {
    return { text: '-', type: 'neutral' }
  }

  const sign = value > 0 ? '↑ ' : value < 0 ? '↓ ' : ''
  const absValue = Math.abs(value)
  const text = isPercent ? formatPercent(absValue, 1) : formatNumber(absValue, 1)
  const type = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'

  return { text: `${sign}${text}`, type }
}
