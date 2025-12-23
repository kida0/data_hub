import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { metricsAPI } from '../services/api'
import './MetricCategoryModal.css'

function MetricCategoryModal({ isOpen, onClose, onSave, initialMetrics }) {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedMetric, setDraggedMetric] = useState(null)
  const [dragOverZone, setDragOverZone] = useState(null)
  const [categorizedMetrics, setCategorizedMetrics] = useState({
    primary: [],
    secondary: [],
    guardrail: []
  })
  const [collapsedZones, setCollapsedZones] = useState({
    primary: false,
    secondary: false,
    guardrail: false
  })

  useEffect(() => {
    if (isOpen) {
      fetchMetrics()
      if (initialMetrics) {
        setCategorizedMetrics(initialMetrics)
      }
    }
  }, [isOpen, initialMetrics])

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

  // 카테고리에 할당된 지표 제외
  const assignedMetricIds = [
    ...categorizedMetrics.primary.map(m => m.id),
    ...categorizedMetrics.secondary.map(m => m.id),
    ...categorizedMetrics.guardrail.map(m => m.id)
  ]

  const filteredMetrics = metrics.filter(metric => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = metric.name.toLowerCase().includes(searchLower) ||
      (metric.description && metric.description.toLowerCase().includes(searchLower))
    const notAssigned = !assignedMetricIds.includes(metric.id)
    return matchesSearch && notAssigned
  })

  const handleDragStart = (e, metric) => {
    setDraggedMetric(metric)
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedMetric(null)
    setDragOverZone(null)
  }

  const handleDragOver = (e, zone) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverZone(zone)
  }

  const handleDragLeave = () => {
    setDragOverZone(null)
  }

  const handleDrop = (e, targetZone) => {
    e.preventDefault()
    setDragOverZone(null)

    if (!draggedMetric) return

    // 각 존의 최대 개수 확인
    const zone = metricZones.find(z => z.key === targetZone)
    if (zone?.maxCount) {
      const currentCount = categorizedMetrics[targetZone].length
      const isAlreadyInZone = categorizedMetrics[targetZone].find(m => m.id === draggedMetric.id)

      if (currentCount >= zone.maxCount && !isAlreadyInZone) {
        alert(`${zone.label}는 최대 ${zone.maxCount}개까지 설정할 수 있습니다.`)
        return
      }
    }

    // 기존 위치에서 제거
    const newCategorizedMetrics = { ...categorizedMetrics }
    Object.keys(newCategorizedMetrics).forEach(key => {
      newCategorizedMetrics[key] = newCategorizedMetrics[key].filter(m => m.id !== draggedMetric.id)
    })

    // 새 위치에 추가
    newCategorizedMetrics[targetZone] = [...newCategorizedMetrics[targetZone], draggedMetric]
    setCategorizedMetrics(newCategorizedMetrics)
    setDraggedMetric(null)
  }

  const handleRemove = (metricId, zone) => {
    const newCategorizedMetrics = { ...categorizedMetrics }
    newCategorizedMetrics[zone] = newCategorizedMetrics[zone].filter(m => m.id !== metricId)
    setCategorizedMetrics(newCategorizedMetrics)
  }

  const toggleZone = (zone) => {
    setCollapsedZones(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }))
  }

  const handleSave = () => {
    onSave(categorizedMetrics)
    onClose()
  }

  if (!isOpen) return null

  const metricZones = [
    {
      key: 'primary',
      label: '주요 지표',
      description: '의사결정의 핵심이 되는 1~2개 지표',
      color: '#ef4444',
      maxCount: 2
    },
    {
      key: 'secondary',
      label: '보조 지표',
      description: '추가로 모니터링할 지표',
      color: '#f59e0b',
      maxCount: 4
    },
    {
      key: 'guardrail',
      label: '가드레일 지표',
      description: '악화되면 안 되는 지표',
      color: '#3b82f6',
      maxCount: 4
    }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content metric-category-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-elegant">
          <div className="modal-header-content">
            <h2 className="modal-title-elegant">측정 지표 분류</h2>
            <p className="modal-subtitle">
              지표를 드래그하여 주요/보조/가드레일로 분류하세요
            </p>
          </div>
          <button className="modal-close-btn-elegant" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body-split-vertical">
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
                    <p>모든 지표가 할당되었습니다</p>
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

          {/* 오른쪽: 지표 카테고리 섹션들 */}
          <div className="metric-category-zones-container">
            {metricZones.map(zone => (
              <div
                key={zone.key}
                className={`metric-category-zone-wrapper ${collapsedZones[zone.key] ? 'collapsed' : ''}`}
              >
                <div
                  className="metric-category-zone-header clickable"
                  style={{ borderLeftColor: zone.color }}
                  onClick={() => toggleZone(zone.key)}
                >
                  <div className="metric-category-zone-header-content">
                    <div className="metric-category-zone-title-row">
                      <h4 className="metric-category-zone-title">{zone.label}</h4>
                      <button className="zone-toggle-btn" aria-label="섹션 접기/펴기">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`chevron-icon ${collapsedZones[zone.key] ? 'collapsed' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>
                    <p className="metric-category-zone-description">{zone.description}</p>
                    {zone.maxCount && (
                      <p className="metric-category-zone-limit">최대 {zone.maxCount}개</p>
                    )}
                  </div>
                  <span className="metric-category-zone-count" style={{ backgroundColor: zone.color }}>
                    {categorizedMetrics[zone.key].length}개
                  </span>
                </div>

                {!collapsedZones[zone.key] && (
                  <div
                    className={`metric-category-drop-zone ${dragOverZone === zone.key ? 'drag-over' : ''} ${categorizedMetrics[zone.key].length === 0 ? 'empty' : ''}`}
                    onDragOver={(e) => handleDragOver(e, zone.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, zone.key)}
                  >
                    {categorizedMetrics[zone.key].length === 0 ? (
                      <div className="metric-category-placeholder">
                        <p>지표를 여기로 드래그하세요</p>
                      </div>
                    ) : (
                      <div className="metric-category-metrics-list">
                        {categorizedMetrics[zone.key].map((metric, index) => (
                          <div
                            key={metric.id}
                            className="metric-category-metric-card"
                            style={{ animationDelay: `${index * 0.03}s` }}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, metric)}
                            onDragEnd={handleDragEnd}
                          >
                            <button
                              className="remove-metric-btn"
                              onClick={() => handleRemove(metric.id, zone.key)}
                              aria-label="지표 제거"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                            <div className="metric-category-metric-content">
                              <div className="metric-category-metric-info">
                                <h5 className="metric-category-metric-name">{metric.name}</h5>
                                {metric.description && (
                                  <p className="metric-category-metric-description">{metric.description}</p>
                                )}
                              </div>
                              {metric.category && (
                                <span className="metric-badge-small">{metric.category}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer-elegant">
          <div className="footer-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>드래그하여 지표를 분류하거나, X 버튼으로 제거할 수 있습니다</span>
          </div>
          <div className="footer-actions">
            <button className="btn-elegant btn-secondary-elegant" onClick={onClose} disabled={loading}>
              취소
            </button>
            <button className="btn-elegant btn-primary-elegant" onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                  저장 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  저장
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

MetricCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialMetrics: PropTypes.shape({
    primary: PropTypes.array,
    secondary: PropTypes.array,
    guardrail: PropTypes.array
  })
}

export default MetricCategoryModal
