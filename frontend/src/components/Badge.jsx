// Badge Component - Used in 8 pages
// Supports multiple variants for different use cases
import PropTypes from 'prop-types'

function Badge({ children, variant = 'default', className = '' }) {
  const getVariantClass = () => {
    const variantMap = {
      default: 'badge',
      active: 'badge badge-active',
      inactive: 'badge badge-inactive',
      info: 'badge badge-info',
      warning: 'badge badge-warning',
      error: 'badge badge-error',
      category: 'badge-category',
      tag: 'badge-tag',
      // Status variants
      completed: 'badge status-completed',
      ongoing: 'badge status-ongoing',
      archived: 'badge status-archived',
      running: 'badge status-running',
      analyzing: 'badge status-analyzing',
      draft: 'badge status-draft',
      // Type variants
      'ab-test': 'badge type-ab-test',
      campaign: 'badge type-campaign',
      feature: 'badge type-feature',
      analysis: 'badge type-analysis',
      // Goal/Variant
      goal: 'badge badge-goal',
      variant: 'badge badge-variant',
    }

    return variantMap[variant] || 'badge'
  }

  return <span className={`${getVariantClass()} ${className}`.trim()}>{children}</span>
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default',
    'active',
    'inactive',
    'info',
    'warning',
    'error',
    'category',
    'tag',
    'completed',
    'ongoing',
    'archived',
    'running',
    'analyzing',
    'draft',
    'ab-test',
    'campaign',
    'feature',
    'analysis',
    'goal',
    'variant',
  ]),
  className: PropTypes.string,
}

export default Badge
