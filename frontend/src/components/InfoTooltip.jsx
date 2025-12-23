import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import './InfoTooltip.css'

function InfoTooltip({ title, description, example, checklist }) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleClose = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
  }

  return (
    <div className="info-tooltip-wrapper" ref={tooltipRef}>
      <button
        type="button"
        className="info-tooltip-trigger"
        onClick={handleToggle}
        aria-label="도움말 보기"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="info-tooltip-popup">
          <div className="info-tooltip-header">
            <h4 className="info-tooltip-title">{title}</h4>
            <button
              type="button"
              className="info-tooltip-close"
              onClick={handleClose}
              aria-label="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="info-tooltip-content">
            {description && (
              <div className="tooltip-section">
                <div className="tooltip-section-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span className="tooltip-section-title">왜 중요한가요?</span>
                </div>
                <p className="tooltip-description">{description}</p>
              </div>
            )}

            {example && (
              <div className="tooltip-section">
                <div className="tooltip-section-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span className="tooltip-section-title">좋은 예시</span>
                </div>
                <div className="tooltip-example">{example}</div>
              </div>
            )}

            {checklist && checklist.length > 0 && (
              <div className="tooltip-section">
                <div className="tooltip-section-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span className="tooltip-section-title">체크리스트</span>
                </div>
                <ul className="tooltip-checklist">
                  {checklist.map((item, index) => (
                    <li key={index} className="tooltip-checklist-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

InfoTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  example: PropTypes.string,
  checklist: PropTypes.arrayOf(PropTypes.string)
}

export default InfoTooltip
