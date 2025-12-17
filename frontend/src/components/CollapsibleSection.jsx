// Collapsible Section Component - Used in detail pages
import { useState } from 'react'
import PropTypes from 'prop-types'

function CollapsibleSection({ title, defaultExpanded = true, children, className = '' }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={`collapsible-section ${!expanded ? 'collapsed' : ''} ${className}`.trim()}>
      <div className="collapsible-header" onClick={toggleExpanded}>
        <div className="section-title">{title}</div>
        <svg
          className={`chevron-icon ${expanded ? 'expanded' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {expanded && <div className="collapsible-content">{children}</div>}
    </div>
  )
}

CollapsibleSection.propTypes = {
  title: PropTypes.string.isRequired,
  defaultExpanded: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default CollapsibleSection
