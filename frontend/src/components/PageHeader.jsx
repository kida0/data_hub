// Page Header Component - Used in 9 pages
import PropTypes from 'prop-types'

function PageHeader({ title, description, subtitle, actions, children }) {
  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
      {description && <p className="page-description">{description}</p>}
      {children}
    </div>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
}

export default PageHeader
