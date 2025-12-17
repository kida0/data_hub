// Metric Display Component - Used in 6 pages
// Displays a metric value with optional change indicator
import PropTypes from 'prop-types'

function MetricDisplay({ value, change, unit, changeType, showArrow = true, className = '' }) {
  const getChangeClass = () => {
    if (!changeType) return 'metric-change neutral'
    return `metric-change ${changeType}`
  }

  const renderChange = () => {
    if (change === undefined || change === null) return null

    return (
      <span className={getChangeClass()}>
        {showArrow && changeType === 'positive' && '↑ '}
        {showArrow && changeType === 'negative' && '↓ '}
        {change}
      </span>
    )
  }

  return (
    <div className={`metric-display ${className}`.trim()}>
      <span className="metric-value">
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </span>
      {renderChange()}
    </div>
  )
}

MetricDisplay.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  changeType: PropTypes.oneOf(['positive', 'negative', 'neutral']),
  showArrow: PropTypes.bool,
  className: PropTypes.string,
}

export default MetricDisplay
