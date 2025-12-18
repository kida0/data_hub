import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { segmentsAPI } from '../services/api'
import './SegmentSelectModal.css'

function SegmentSelectModal({ isOpen, onClose, onSelect, selectedSegmentId = null }) {
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [tempSelected, setTempSelected] = useState(null)
  const [draggedSegment, setDraggedSegment] = useState(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSegments()
      // 선택된 세그먼트 ID로 초기화
      if (selectedSegmentId && segments.length > 0) {
        const selected = segments.find(s => s.id === selectedSegmentId)
        setTempSelected(selected || null)
      } else {
        setTempSelected(null)
      }
    }
  }, [isOpen, selectedSegmentId])

  const fetchSegments = async () => {
    try {
      setLoading(true)
      const response = await segmentsAPI.getAll({ limit: 100 })
      setSegments(response.data.items || [])
    } catch (err) {
      console.error('Error fetching segments:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredSegments = segments.filter(segment => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = segment.name.toLowerCase().includes(searchLower) ||
      (segment.description && segment.description.toLowerCase().includes(searchLower))
    const notSelected = !tempSelected || tempSelected.id !== segment.id
    return matchesSearch && notSelected
  })

  const handleDragStart = (e, segment) => {
    setDraggedSegment(segment)
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedSegment(null)
    setIsDraggingOver(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDraggingOver(true)
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDraggingOver(false)

    if (!draggedSegment) return
    setTempSelected(draggedSegment)
    setDraggedSegment(null)
  }

  const handleSegmentClick = (segment) => {
    setTempSelected(segment)
  }

  const handleRemove = () => {
    setTempSelected(null)
  }

  const handleComplete = () => {
    onSelect(tempSelected)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content segment-select-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-elegant">
          <div className="modal-header-content">
            <h2 className="modal-title-elegant">세그먼트 선택</h2>
            <p className="modal-subtitle">
              세그먼트를 선택하거나 드래그하여 오른쪽으로 이동하세요
            </p>
          </div>
          <button className="modal-close-btn-elegant" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body-split">
          {/* 왼쪽: 모든 세그먼트 */}
          <div className="segments-panel left-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                모든 세그먼트
              </h3>
              <span className="panel-count">{filteredSegments.length}개</span>
            </div>

            <div className="search-box-elegant">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="세그먼트 이름이나 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-elegant"
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading-elegant">
                <div className="loading-spinner"></div>
                <p>세그먼트를 불러오는 중...</p>
              </div>
            ) : (
              <div className="segments-scroll-area">
                {filteredSegments.map((segment) => (
                  <div
                    key={segment.id}
                    className="segment-card draggable"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, segment)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleSegmentClick(segment)}
                  >
                    <div className="segment-card-header">
                      <div className="segment-card-drag-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="9" x2="19" y2="9"></line>
                          <line x1="5" y1="15" x2="19" y2="15"></line>
                        </svg>
                      </div>
                      <h4 className="segment-card-name">{segment.name}</h4>
                      {segment.category && (
                        <span className="segment-badge">{segment.category}</span>
                      )}
                    </div>
                    {segment.description && (
                      <p className="segment-card-description">{segment.description}</p>
                    )}
                    <div className="segment-card-stats">
                      <span className="segment-stat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        {segment.customer_count?.toLocaleString() || 0}명
                      </span>
                    </div>
                  </div>
                ))}
                {filteredSegments.length === 0 && (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <p>검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 가운데 화살표 */}
          <div className="panel-divider">
            <div className="divider-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          {/* 오른쪽: 선택된 세그먼트 */}
          <div className="segments-panel right-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                선택된 세그먼트
              </h3>
              <span className="panel-count">{tempSelected ? '1개' : '0개'}</span>
            </div>

            <div
              className={`drop-zone ${isDraggingOver ? 'drag-over' : ''} ${!tempSelected ? 'empty' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!tempSelected ? (
                <div className="drop-zone-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <p className="placeholder-text">여기로 드래그하거나</p>
                  <p className="placeholder-subtext">왼쪽 세그먼트를 클릭하세요</p>
                </div>
              ) : (
                <div className="selected-segments-list">
                  <div className="selected-segment-card">
                    <button
                      className="remove-segment-btn"
                      onClick={handleRemove}
                      aria-label="세그먼트 제거"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <div className="selected-segment-content">
                      <div className="selected-segment-header">
                        <h4 className="selected-segment-name">{tempSelected.name}</h4>
                        {tempSelected.category && (
                          <span className="segment-badge selected">{tempSelected.category}</span>
                        )}
                      </div>
                      {tempSelected.description && (
                        <p className="selected-segment-description">{tempSelected.description}</p>
                      )}
                      <div className="selected-segment-stats">
                        <span className="segment-stat">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          {tempSelected.customer_count?.toLocaleString() || 0}명
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer-elegant">
          <button className="btn-elegant btn-secondary-elegant" onClick={onClose}>
            취소
          </button>
          <button
            className="btn-elegant btn-primary-elegant"
            onClick={handleComplete}
            disabled={!tempSelected}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            완료 {tempSelected && `(${tempSelected.name})`}
          </button>
        </div>
      </div>
    </div>
  )
}

SegmentSelectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedSegmentId: PropTypes.number
}

export default SegmentSelectModal
