import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { metricsAPI } from '../services/api'
import './MetricSelectModal.css'

function MetricSelectModal({ isOpen, onClose, onSelect, selectedMetrics = [], singleSelect = false }) {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [tempSelected, setTempSelected] = useState([])
  const [draggedMetric, setDraggedMetric] = useState(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedMetrics)
      fetchMetrics()
    }
  }, [isOpen, selectedMetrics])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await metricsAPI.getAll({ limit: 100 })
      setMetrics(response.data.items || [])
    } catch (err) {
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredMetrics = metrics.filter(metric => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = metric.name.toLowerCase().includes(searchLower) ||
      (metric.description && metric.description.toLowerCase().includes(searchLower))
    const notSelected = !tempSelected.some(m => m.id === metric.id)
    return matchesSearch && notSelected
  })

  const handleDragStart = (e, metric) => {
    setDraggedMetric(metric)
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedMetric(null)
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

    if (!draggedMetric) return

    if (singleSelect) {
      setTempSelected([draggedMetric])
    } else {
      if (tempSelected.length >= 4) {
        alert('최대 4개까지 선택 가능합니다.')
        return
      }
      if (!tempSelected.some(m => m.id === draggedMetric.id)) {
        setTempSelected([...tempSelected, draggedMetric])
      }
    }
    setDraggedMetric(null)
  }

  const handleMetricClick = (metric) => {
    if (singleSelect) {
      setTempSelected([metric])
    } else {
      if (tempSelected.length >= 4) {
        alert('최대 4개까지 선택 가능합니다.')
        return
      }
      if (!tempSelected.some(m => m.id === metric.id)) {
        setTempSelected([...tempSelected, metric])
      }
    }
  }

  const handleRemove = (metricId) => {
    setTempSelected(tempSelected.filter(m => m.id !== metricId))
  }

  const handleComplete = () => {
    onSelect(tempSelected)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content metric-select-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-elegant">
          <div className="modal-header-content">
            <h2 className="modal-title-elegant">지표 선택</h2>
            <p className="modal-subtitle">
              {singleSelect
                ? '지표를 선택하거나 드래그하여 오른쪽으로 이동하세요'
                : `지표를 선택하거나 드래그하여 오른쪽으로 이동하세요 (최대 4개)`}
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
          {/* 왼쪽: 모든 지표 */}
          <div className="metrics-panel left-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                모든 지표
              </h3>
              <span className="panel-count">{filteredMetrics.length}개</span>
            </div>

            <div className="search-box-elegant">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="지표 이름이나 설명으로 검색..."
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
                <p>지표를 불러오는 중...</p>
              </div>
            ) : (
              <div className="metrics-scroll-area">
                {filteredMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="metric-card draggable"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, metric)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleMetricClick(metric)}
                  >
                    <div className="metric-card-header">
                      <div className="metric-card-drag-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="9" x2="19" y2="9"></line>
                          <line x1="5" y1="15" x2="19" y2="15"></line>
                        </svg>
                      </div>
                      <h4 className="metric-card-name">{metric.name}</h4>
                      {metric.category && (
                        <span className="metric-badge">{metric.category}</span>
                      )}
                    </div>
                    {metric.description && (
                      <p className="metric-card-description">{metric.description}</p>
                    )}
                  </div>
                ))}
                {filteredMetrics.length === 0 && (
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

          {/* 오른쪽: 선택된 지표 */}
          <div className="metrics-panel right-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                선택된 지표
              </h3>
              <span className={`panel-count ${tempSelected.length >= 4 && !singleSelect ? 'limit-reached' : ''}`}>
                {singleSelect ? (tempSelected.length > 0 ? '1개' : '0개') : `${tempSelected.length} / 4개`}
              </span>
            </div>

            <div
              className={`drop-zone ${isDraggingOver ? 'drag-over' : ''} ${tempSelected.length === 0 ? 'empty' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {tempSelected.length === 0 ? (
                <div className="drop-zone-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                  <p className="placeholder-text">여기로 드래그하거나</p>
                  <p className="placeholder-subtext">왼쪽 지표를 클릭하세요</p>
                </div>
              ) : (
                <div className="selected-metrics-list">
                  {tempSelected.map((metric, index) => (
                    <div key={metric.id} className="selected-metric-card" style={{ animationDelay: `${index * 0.05}s` }}>
                      <button
                        className="remove-metric-btn"
                        onClick={() => handleRemove(metric.id)}
                        aria-label="지표 제거"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      <div className="selected-metric-content">
                        <div className="selected-metric-header">
                          <h4 className="selected-metric-name">{metric.name}</h4>
                          {metric.category && (
                            <span className="metric-badge selected">{metric.category}</span>
                          )}
                        </div>
                        {metric.description && (
                          <p className="selected-metric-description">{metric.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
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
            disabled={tempSelected.length === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            완료 ({tempSelected.length}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}

MetricSelectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedMetrics: PropTypes.array,
  singleSelect: PropTypes.bool
}

export default MetricSelectModal
