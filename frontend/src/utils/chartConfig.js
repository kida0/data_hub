// Chart.js common configuration utilities

/**
 * Default chart colors matching design system
 */
export const chartColors = {
  primary: '#020760',
  primaryLight: '#e8eaff',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  gray: '#6b7280',
  border: '#e5e7eb',
}

/**
 * Default font configuration
 */
export const defaultFontConfig = {
  family: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  size: 12,
  weight: '500',
  color: '#374151',
}

/**
 * Common chart options (can be extended by specific charts)
 */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        font: {
          family: defaultFontConfig.family,
          size: 12,
          weight: '500',
        },
        color: defaultFontConfig.color,
        padding: 12,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: defaultFontConfig.family,
        size: 13,
        weight: '600',
      },
      bodyFont: {
        family: defaultFontConfig.family,
        size: 12,
        weight: '500',
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: defaultFontConfig.family,
          size: 11,
        },
        color: '#9ca3af',
      },
    },
    y: {
      grid: {
        color: chartColors.border,
        drawBorder: false,
      },
      ticks: {
        font: {
          family: defaultFontConfig.family,
          size: 11,
        },
        color: '#9ca3af',
        padding: 8,
      },
    },
  },
}

/**
 * Generate line chart options
 * @param {object} customOptions - Custom options to override defaults
 * @returns {object} Chart.js options
 */
export const getLineChartOptions = (customOptions = {}) => {
  return {
    ...defaultChartOptions,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    ...customOptions,
  }
}

/**
 * Generate bar chart options
 * @param {object} customOptions - Custom options to override defaults
 * @returns {object} Chart.js options
 */
export const getBarChartOptions = (customOptions = {}) => {
  return {
    ...defaultChartOptions,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    ...customOptions,
  }
}

/**
 * Generate doughnut/pie chart options
 * @param {object} customOptions - Custom options to override defaults
 * @returns {object} Chart.js options
 */
export const getDoughnutChartOptions = (customOptions = {}) => {
  const options = { ...defaultChartOptions }
  delete options.scales // Doughnut charts don't use scales

  return {
    ...options,
    cutout: '70%',
    plugins: {
      ...options.plugins,
      legend: {
        ...options.plugins.legend,
        position: 'right',
      },
    },
    ...customOptions,
  }
}

/**
 * Generate dataset with default styling
 * @param {string} label - Dataset label
 * @param {Array} data - Data points
 * @param {string} color - Primary color (defaults to theme primary)
 * @param {string} type - Chart type: 'line', 'bar', 'doughnut'
 * @returns {object} Dataset configuration
 */
export const createDataset = (label, data, color = chartColors.primary, type = 'line') => {
  const baseDataset = {
    label,
    data,
  }

  switch (type) {
    case 'line':
      return {
        ...baseDataset,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }

    case 'bar':
      return {
        ...baseDataset,
        backgroundColor: color,
        borderRadius: 6,
        borderSkipped: false,
      }

    case 'doughnut':
      return {
        ...baseDataset,
        backgroundColor: [
          chartColors.primary,
          chartColors.info,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
          chartColors.gray,
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff',
      }

    default:
      return baseDataset
  }
}

/**
 * Format number for chart display
 * @param {number} value - Value to format
 * @param {string} unit - Unit to append (e.g., '%', '원', '명')
 * @returns {string} Formatted value
 */
export const formatChartValue = (value, unit = '') => {
  if (value === null || value === undefined) return '-'

  // Handle large numbers
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M${unit}`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${unit}`
  }

  return `${value}${unit}`
}
