import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { metricsAPI } from '../services/api'
import './MetricPriorityModal.css'

function MetricPriorityModal({ isOpen, onClose, onSave }) {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedMetric, setDraggedMetric] = useState(null)
  const [dragOverZone, setDragOverZone] = useState(null)
  const [priorityMetrics, setPriorityMetrics] = useState({
    P0: [],
    P1: [],
    P2: [],
    None: []
  })
  const [collapsedZones, setCollapsedZones] = useState({
    P0: false,
    P1: false,
    P2: false,
    None: false
  })

  useEffect(() => {
    if (isOpen) {
      fetchMetrics()
    }
  }, [isOpen])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await metricsAPI.getAll({ limit: 100 })
      const allMetrics = response.data.items || []

      // 우선순위별로 분류
      const grouped = {
        P0: allMetrics.filter(m => m.priority === 'P0'),
        P1: allMetrics.filter(m => m.priority === 'P1'),
        P2: allMetrics.filter(m => m.priority === 'P2'),
        None: allMetrics.filter(m => !m.priority || m.priority === 'None')
      }

      setPriorityMetrics(grouped)
      setMetrics(allMetrics)
    } catch (err) {
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  // 모든 섹션에서 이미 할당된 지표 제외
  const assignedMetricIds = [
    ...priorityMetrics.P0.map(m => m.id),
    ...priorityMetrics.P1.map(m => m.id),
    ...priorityMetrics.P2.map(m => m.id),
    ...priorityMetrics.None.map(m => m.id)
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

    // 기존 위치에서 제거 (드래그 시작 위치가 오른쪽 섹션인 경우)
    const newPriorityMetrics = { ...priorityMetrics }
    Object.keys(newPriorityMetrics).forEach(key => {
      newPriorityMetrics[key] = newPriorityMetrics[key].filter(m => m.id !== draggedMetric.id)
    })

    // 새 위치에 추가
    newPriorityMetrics[targetZone] = [...newPriorityMetrics[targetZone], draggedMetric]
    setPriorityMetrics(newPriorityMetrics)
    setDraggedMetric(null)
  }

  const handleMetricClick = (metric, zone) => {
    const newPriorityMetrics = { ...priorityMetrics }

    // 기존 위치에서 제거
    Object.keys(newPriorityMetrics).forEach(key => {
      newPriorityMetrics[key] = newPriorityMetrics[key].filter(m => m.id !== metric.id)
    })

    // 새 위치에 추가
    newPriorityMetrics[zone] = [...newPriorityMetrics[zone], metric]
    setPriorityMetrics(newPriorityMetrics)
  }

  const handleRemove = (metricId, zone) => {
    const newPriorityMetrics = { ...priorityMetrics }
    newPriorityMetrics[zone] = newPriorityMetrics[zone].filter(m => m.id !== metricId)
    setPriorityMetrics(newPriorityMetrics)
  }

  const toggleZone = (zone) => {
    setCollapsedZones(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }))
  }

  const handleSave = async () => {
    try {
      // 각 지표의 우선순위 업데이트
      const updates = []
      Object.entries(priorityMetrics).forEach(([priority, metricsList]) => {
        metricsList.forEach(metric => {
          updates.push({
            id: metric.id,
            priority: priority === 'None' ? null : priority
          })
        })
      })

      // API 호출은 실제 구현에 따라 수정 필요
      // await Promise.all(updates.map(update => metricsAPI.update(update.id, { priority: update.priority })))

      onSave(priorityMetrics)
      onClose()
    } catch (err) {
      console.error('Error saving priorities:', err)
    }
  }

  if (!isOpen) return null

  const priorityZones = [
    { key: 'P0', label: 'P0 (최우선)', description: '핵심 비즈니스 지표', color: '#ef4444' },
    { key: 'P1', label: 'P1 (중요)', description: '중요 모니터링 지표', color: '#f59e0b' },
    { key: 'P2', label: 'P2 (보통)', description: '일반 추적 지표', color: '#3b82f6' },
    { key: 'None', label: '제외', description: '우선순위 없음', color: '#9ca3af' }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content priority-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-elegant">
          <div className="modal-header-content">
            <h2 className="modal-title-elegant">지표 우선순위 관리</h2>
            <p className="modal-subtitle">
              지표를 드래그하여 우선순위를 설정하세요 (P0 ~ P2, 제외)
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

          {/* 오른쪽: 우선순위 섹션들 */}
          <div className="priority-zones-container">
            {priorityZones.map(zone => (
              <div
                key={zone.key}
                className={`priority-zone-wrapper ${collapsedZones[zone.key] ? 'collapsed' : ''}`}
              >
                <div
                  className="priority-zone-header clickable"
                  style={{ borderLeftColor: zone.color }}
                  onClick={() => toggleZone(zone.key)}
                >
                  <div className="priority-zone-header-content">
                    <div className="priority-zone-title-row">
                      <h4 className="priority-zone-title">{zone.label}</h4>
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
                    <p className="priority-zone-description">{zone.description}</p>
                  </div>
                  <span className="priority-zone-count" style={{ backgroundColor: zone.color }}>
                    {priorityMetrics[zone.key].length}개
                  </span>
                </div>

                {!collapsedZones[zone.key] && (
                  <div
                    className={`priority-drop-zone ${dragOverZone === zone.key ? 'drag-over' : ''} ${priorityMetrics[zone.key].length === 0 ? 'empty' : ''}`}
                    onDragOver={(e) => handleDragOver(e, zone.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, zone.key)}
                  >
                    {priorityMetrics[zone.key].length === 0 ? (
                      <div className="priority-placeholder">
                        <p>지표를 여기로 드래그하세요</p>
                      </div>
                    ) : (
                      <div className="priority-metrics-list">
                        {priorityMetrics[zone.key].map((metric, index) => (
                          <div
                            key={metric.id}
                            className="priority-metric-card"
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
                            <div className="priority-metric-content">
                              <div className="priority-metric-info">
                                <h5 className="priority-metric-name">{metric.name}</h5>
                                {metric.description && (
                                  <p className="priority-metric-description">{metric.description}</p>
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
            <span>드래그하여 우선순위를 설정하거나, X 버튼으로 제거할 수 있습니다</span>
          </div>
          <div className="footer-actions">
            <button className="btn-elegant btn-secondary-elegant" onClick={onClose}>
              취소
            </button>
            <button className="btn-elegant btn-primary-elegant" onClick={handleSave}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

MetricPriorityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default MetricPriorityModal
