import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import MetricSelectModal from '../components/MetricSelectModal'
import './SegmentCreate.css'
import { segmentsAPI } from '../services/api'

function SegmentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    segment_owner: '키다',
    category: '',
    tags: '',
    refresh_period: '',
    query: ''
  })
  const [selectedMetrics, setSelectedMetrics] = useState([])
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['신규 획득', '리텐션', '재활성화', 'VIP 관리', 'User Behavior']
  const refreshPeriods = ['실시간', '1시간', '6시간', '12시간', '일별', '주별']

  useEffect(() => {
    fetchSegmentData()
  }, [id])

  const fetchSegmentData = async () => {
    try {
      setLoadingData(true)
      const response = await segmentsAPI.getById(id)
      const segment = response.data

      // formData 설정
      setFormData({
        name: segment.name || '',
        description: segment.description || '',
        segment_owner: segment.segment_owner || '키다',
        category: segment.category || '',
        tags: segment.tags || '',
        refresh_period: segment.refresh_period || '',
        query: segment.query || ''
      })

      // 선택된 지표 복원 (metric1~4에서)
      const metrics = []
      if (segment.metric1_label && segment.metric1_value) {
        metrics.push({ id: parseInt(segment.metric1_value) || 0, name: segment.metric1_label })
      }
      if (segment.metric2_label && segment.metric2_value) {
        metrics.push({ id: parseInt(segment.metric2_value) || 0, name: segment.metric2_label })
      }
      if (segment.metric3_label && segment.metric3_value) {
        metrics.push({ id: parseInt(segment.metric3_value) || 0, name: segment.metric3_label })
      }
      if (segment.metric4_label && segment.metric4_value) {
        metrics.push({ id: parseInt(segment.metric4_value) || 0, name: segment.metric4_label })
      }
      setSelectedMetrics(metrics)

      setError(null)
    } catch (err) {
      console.error('Error fetching segment:', err)
      setError('세그먼트 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMetricSelect = (metrics) => {
    setSelectedMetrics(metrics)
  }

  const handleRemoveMetric = (metricId) => {
    setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name || !formData.description || !formData.category) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    try {
      setLoading(true)

      // 선택된 지표를 metric1~4에 매핑
      const segmentData = {
        ...formData,
        metric1_label: selectedMetrics[0]?.name || null,
        metric1_value: selectedMetrics[0]?.id.toString() || null,
        metric2_label: selectedMetrics[1]?.name || null,
        metric2_value: selectedMetrics[1]?.id.toString() || null,
        metric3_label: selectedMetrics[2]?.name || null,
        metric3_value: selectedMetrics[2]?.id.toString() || null,
        metric4_label: selectedMetrics[3]?.name || null,
        metric4_value: selectedMetrics[3]?.id.toString() || null
      }

      await segmentsAPI.update(id, segmentData)
      navigate(`/segments/${id}`)
    } catch (err) {
      console.error('Error updating segment:', err)
      setError('세그먼트 수정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(`/segments/${id}`)
  }

  if (loadingData) {
    return (
      <div className="segment-create-page">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="segment-create-page">
      <PageHeader
        title="세그먼트 편집"
        description="고객 세그먼트 정보를 수정할 수 있습니다."
      />

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3 className="form-section-title">기본 정보</h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                세그먼트명 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="세그먼트명을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                세그먼트 설명 <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="세그먼트에 대한 설명을 입력하세요"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="segment_owner" className="form-label">
                세그먼트 오너 <span className="required">*</span>
              </label>
              <select
                id="segment_owner"
                name="segment_owner"
                value={formData.segment_owner}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="키다">키다</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  카테고리 <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="refresh_period" className="form-label">
                  갱신주기
                </label>
                <select
                  id="refresh_period"
                  name="refresh_period"
                  value={formData.refresh_period}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">선택하세요</option>
                  {refreshPeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                태그
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="태그를 입력하세요 (쉼표로 구분)"
              />
              <span className="form-hint">예: 신규유저, 활성유저, VIP</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">쿼리 설정</h3>

            <div className="form-group">
              <label htmlFor="query" className="form-label">
                쿼리문 입력
              </label>
              <div className="query-input-container">
                <textarea
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  className="form-textarea query-textarea"
                  placeholder="SQL 쿼리를 입력하세요..."
                  rows="8"
                />
                <button
                  type="button"
                  className="btn btn-ai"
                  disabled
                  title="AI 생성 기능 준비 중"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  AI 생성
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">지표 선택</h3>
            <p className="form-section-description">
              이 세그먼트에서 추적할 지표를 선택하세요 (최대 4개)
            </p>

            <button
              type="button"
              className="btn btn-secondary btn-select-metric"
              onClick={() => setIsMetricModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              지표 선택
            </button>

            {selectedMetrics.length > 0 && (
              <div className="selected-metrics-list">
                {selectedMetrics.map((metric, index) => (
                  <div key={metric.id} className="selected-metric-chip">
                    <span className="metric-chip-number">{index + 1}</span>
                    <span className="metric-chip-name">{metric.name}</span>
                    <button
                      type="button"
                      className="metric-chip-remove"
                      onClick={() => handleRemoveMetric(metric.id)}
                      title="제거"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>
      </div>

      <MetricSelectModal
        isOpen={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
        onSelect={handleMetricSelect}
        selectedMetrics={selectedMetrics}
      />
    </div>
  )
}

export default SegmentEdit
