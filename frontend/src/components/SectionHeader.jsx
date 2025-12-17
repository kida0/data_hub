// Section Header Component - Used in 8 pages
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function SectionHeader({ title, link, linkText = '전체 보기 →', actions, children }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      <div className="section-actions">
        {link && (
          <Link to={link} className="section-link">
            {linkText}
          </Link>
        )}
        {actions}
        {children}
      </div>
    </div>
  )
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  linkText: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
}

export default SectionHeader
