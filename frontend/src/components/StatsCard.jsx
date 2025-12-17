// Stats Card Component - Used in 7 pages
import PropTypes from 'prop-types'

function StatsCard({ label, value, change, changeType, unit, icon, className = '' }) {
  const getChangeClass = () => {
    if (!changeType) return 'stat-change neutral'
    return `stat-change ${changeType}`
  }

  return (
    <div className={`stat-box ${className}`}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {change !== undefined && change !== null && (
        <div className={getChangeClass()}>
          {changeType === 'positive' && '↑ '}
          {changeType === 'negative' && '↓ '}
          {change}
        </div>
      )}
    </div>
  )
}

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeType: PropTypes.oneOf(['positive', 'negative', 'neutral']),
  unit: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
}

export default StatsCard
