import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import './MetricCreate.css'
import { metricsAPI } from '../services/api'

function MetricEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    metric_owner: '키다',
    priority: '',
    calculation_logic: '',
    status: '',
    data_source: '',
    aggregation_period: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const categories = ['Engagement', 'Revenue', 'Retention', 'Acquisition', 'Product', 'Performance', 'Marketing', 'Operations']
  const priorities = ['P0', 'P1', 'P2', 'P3']
  const statuses = ['활성화', '비활성화', '주의', '대기']
  const aggregationPeriods = ['실시간', '시간별', '일별', '주별', '월별', '분기별', '연별']

  useEffect(() => {
    fetchMetric()
  }, [id])

  const fetchMetric = async () => {
    try {
      setLoading(true)
      const response = await metricsAPI.getById(id)
      const metric = response.data
      setFormData({
        name: metric.name || '',
        description: metric.description || '',
        category: metric.category || '',
        metric_owner: metric.metric_owner || '키다',
        priority: metric.priority || '',
        calculation_logic: metric.calculation_logic || '',
        status: metric.status || '',
        data_source: metric.data_source || '',
        aggregation_period: metric.aggregation_period || '',
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching metric:', err)
      setError('지표를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.priority || !formData.calculation_logic) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      await metricsAPI.update(id, formData)
      navigate(`/metrics/${id}`)
    } catch (err) {
      console.error('Error updating metric:', err)
      setError('지표 수정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/metrics/${id}`)
  }

  if (loading) {
    return (
      <div className="metric-create-page">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="metric-create-page">
      <PageHeader title="지표 편집" description="지표 정보를 수정할 수 있습니다." />

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3 className="form-section-title">기본 정보</h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                지표명 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="지표명을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                지표 설명 <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="지표에 대한 설명을 입력하세요"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="metric_owner" className="form-label">
                메트릭 오너 <span className="required">*</span>
              </label>
              <select
                id="metric_owner"
                name="metric_owner"
                value={formData.metric_owner}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="키다">키다</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  지표 중요도 <span className="required">*</span>
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">선택하세요</option>
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="form-group">
              <label htmlFor="calculation_logic" className="form-label">
                계산 로직 <span className="required">*</span>
              </label>
              <textarea
                id="calculation_logic"
                name="calculation_logic"
                value={formData.calculation_logic}
                onChange={handleChange}
                className="form-textarea"
                placeholder="지표 계산 로직을 입력하세요 (예: SUM(value) / COUNT(*))"
                rows="6"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">데이터팀 입력 필드</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  상태
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">선택하세요</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="aggregation_period" className="form-label">
                  집계 기간
                </label>
                <select
                  id="aggregation_period"
                  name="aggregation_period"
                  value={formData.aggregation_period}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">선택하세요</option>
                  {aggregationPeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="data_source" className="form-label">
                데이터 소스
              </label>
              <textarea
                id="data_source"
                name="data_source"
                value={formData.data_source}
                onChange={handleChange}
                className="form-textarea"
                placeholder="데이터 소스를 입력하세요 (예: user_activity_logs, orders)"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Alert 설정</h3>
            <div className="preparing-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Alert 설정 기능은 준비 중입니다.
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MetricEdit
