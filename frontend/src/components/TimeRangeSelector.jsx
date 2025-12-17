// Time Range Selector Component - Used in 3 pages
import { useState } from 'prop-types'
import PropTypes from 'prop-types'

function TimeRangeSelector({ value, onChange, options = null }) {
  const defaultOptions = options || [
    { value: '7', label: '7일' },
    { value: '30', label: '30일' },
    { value: '90', label: '90일' },
    { value: '365', label: '1년' },
  ]

  return (
    <div className="time-selector">
      {defaultOptions.map((option) => (
        <button
          key={option.value}
          className={`time-btn ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

TimeRangeSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
}

export default TimeRangeSelector
