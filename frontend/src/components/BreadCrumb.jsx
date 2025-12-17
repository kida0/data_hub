// BreadCrumb Component - Used in detail pages
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function BreadCrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item.link ? (
            <Link to={item.link} className="breadcrumb-item">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-item active">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="breadcrumb-separator">›</span>}
        </span>
      ))}
    </div>
  )
}

BreadCrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
}

export default BreadCrumb
