import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import MetricSelectModal from '../components/MetricSelectModal'
import SegmentSelectModal from '../components/SegmentSelectModal'
import VariantsBuilder from '../components/VariantsBuilder'
import { experimentsAPI, metricsAPI, segmentsAPI } from '../services/api'
import './ExperimentCreate.css'

function ExperimentCreate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '키다',
    team: '',
    experiment_type: 'A/B Test',
    status: 'draft',
    objective: '',
    hypothesis: '',
    ice_impact: null,
    ice_confidence: null,
    ice_ease: null,
    primary_metric_id: null,
    secondary_metric_ids: [],
    start_date: '',
    end_date: '',
    target_segment_id: null,
    variants: [
      { name: 'Control', description: '', traffic_allocation: 50 },
      { name: 'Variant A', description: '', traffic_allocation: 50 }
    ],
    conditions: '',
    confounding_factors: ''
  })

  const [selectedPrimaryMetric, setSelectedPrimaryMetric] = useState(null)
  const [selectedSecondaryMetrics, setSelectedSecondaryMetrics] = useState([])
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false)
  const [metricModalMode, setMetricModalMode] = useState('primary') // 'primary' or 'secondary'
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(isEditMode)

  // 편집 모드: 기존 데이터 로드
  useEffect(() => {
    if (isEditMode) {
      loadExperimentData()
    }
  }, [id])

  const loadExperimentData = async () => {
    try {
      setInitialLoading(true)
      const response = await experimentsAPI.getById(id)
      const experiment = response.data

      // Variants 파싱
      const variants = experiment.variants ? JSON.parse(experiment.variants) : []

      // Secondary metrics 파싱
      const secondaryMetricIds = experiment.secondary_metric_ids
        ? JSON.parse(experiment.secondary_metric_ids)
        : []

      // FormData 설정
      setFormData({
        name: experiment.name || '',
        description: experiment.description || '',
        owner: experiment.owner || '',
        team: experiment.team || '',
        experiment_type: experiment.experiment_type || 'A/B Test',
        status: experiment.status || 'draft',
        objective: experiment.objective || '',
        hypothesis: experiment.hypothesis || '',
        ice_impact: experiment.ice_impact,
        ice_confidence: experiment.ice_confidence,
        ice_ease: experiment.ice_ease,
        primary_metric_id: experiment.primary_metric_id,
        secondary_metric_ids: secondaryMetricIds,
        start_date: experiment.start_date || '',
        end_date: experiment.end_date || '',
        target_segment_id: experiment.target_segment_id,
        variants: variants,
        conditions: experiment.conditions || '',
        confounding_factors: experiment.confounding_factors || ''
      })

      // 핵심 지표 로드
      if (experiment.primary_metric_id) {
        const metricResponse = await metricsAPI.getById(experiment.primary_metric_id)
        setSelectedPrimaryMetric(metricResponse.data)
      }

      // 보조 지표 로드
      if (secondaryMetricIds.length > 0) {
        const metricsPromises = secondaryMetricIds.map(metricId => metricsAPI.getById(metricId))
        const metricsResponses = await Promise.all(metricsPromises)
        setSelectedSecondaryMetrics(metricsResponses.map(res => res.data))
      }

      // 세그먼트 로드
      if (experiment.target_segment_id) {
        const segmentResponse = await segmentsAPI.getById(experiment.target_segment_id)
        setSelectedSegment(segmentResponse.data)
      }

      setError(null)
    } catch (err) {
      console.error('Error loading experiment:', err)
      setError('실험 데이터를 불러오는데 실패했습니다.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVariantsChange = (variants) => {
    setFormData((prev) => ({
      ...prev,
      variants
    }))
  }

  const openPrimaryMetricModal = () => {
    setMetricModalMode('primary')
    setIsMetricModalOpen(true)
  }

  const openSecondaryMetricModal = () => {
    setMetricModalMode('secondary')
    setIsMetricModalOpen(true)
  }

  const handleMetricSelect = (metrics) => {
    if (metricModalMode === 'primary') {
      // Single select: metrics[0]
      const metric = metrics[0] || null
      setSelectedPrimaryMetric(metric)
      setFormData((prev) => ({
        ...prev,
        primary_metric_id: metric ? metric.id : null
      }))
    } else {
      // Multi select
      setSelectedSecondaryMetrics(metrics)
      setFormData((prev) => ({
        ...prev,
        secondary_metric_ids: metrics.map(m => m.id)
      }))
    }
  }

  const handleSegmentSelect = (segment) => {
    setSelectedSegment(segment)
    setFormData((prev) => ({
      ...prev,
      target_segment_id: segment ? segment.id : null
    }))
  }

  const handleRemoveSecondaryMetric = (metricId) => {
    const updated = selectedSecondaryMetrics.filter(m => m.id !== metricId)
    setSelectedSecondaryMetrics(updated)
    setFormData((prev) => ({
      ...prev,
      secondary_metric_ids: updated.map(m => m.id)
    }))
  }

  // 날짜 차이 계산 (일수)
  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date) return null
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : null
  }

  // ICE 총점 계산
  const calculateICEScore = () => {
    if (!formData.ice_impact || !formData.ice_confidence || !formData.ice_ease) return null
    return Number(formData.ice_impact) + Number(formData.ice_confidence) + Number(formData.ice_ease)
  }

  // 트래픽 할당 검증
  const isValidTraffic = () => {
    const total = formData.variants.reduce((sum, v) => sum + (Number(v.traffic_allocation) || 0), 0)
    return total === 100
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // 필수 필드 검증
    if (!formData.name || !formData.owner || !formData.objective || !formData.hypothesis) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    if (!formData.primary_metric_id) {
      setError('핵심 지표를 선택해주세요.')
      return
    }

    if (!formData.start_date || !formData.end_date) {
      setError('실험 기간을 입력해주세요.')
      return
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('종료일은 시작일보다 이후여야 합니다.')
      return
    }

    if (!formData.target_segment_id) {
      setError('대상 세그먼트를 선택해주세요.')
      return
    }

    if (!isValidTraffic()) {
      setError('트래픽 할당의 합계가 100%가 되어야 합니다.')
      return
    }

    if (formData.variants.length < 2) {
      setError('최소 Control과 1개의 Variant가 필요합니다.')
      return
    }

    try {
      setLoading(true)

      // API 전송을 위한 데이터 변환
      const experimentData = {
        ...formData,
        variants: JSON.stringify(formData.variants),
        secondary_metric_ids: formData.secondary_metric_ids.length > 0
          ? JSON.stringify(formData.secondary_metric_ids)
          : null,
        ice_impact: formData.ice_impact ? Number(formData.ice_impact) : null,
        ice_confidence: formData.ice_confidence ? Number(formData.ice_confidence) : null,
        ice_ease: formData.ice_ease ? Number(formData.ice_ease) : null,
        description: formData.description || null,
        team: formData.team || null,
        conditions: formData.conditions || null,
        confounding_factors: formData.confounding_factors || null
      }

      if (isEditMode) {
        await experimentsAPI.update(id, experimentData)
      } else {
        await experimentsAPI.create(experimentData)
      }
      navigate('/experiments')
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} experiment:`, err)

      // 백엔드에서 온 상세 에러 메시지 추출
      let errorMessage = isEditMode ? '실험 수정에 실패했습니다.' : '실험 생성에 실패했습니다.'

      if (err.response?.data?.detail) {
        // FastAPI의 기본 에러 형식
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail
        } else if (Array.isArray(err.response.data.detail)) {
          // Pydantic 검증 에러 (배열 형태)
          errorMessage = err.response.data.detail
            .map(e => `${e.loc?.join(' > ') || ''}: ${e.msg}`)
            .join(', ')
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = `실험 생성 실패: ${err.message}`
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/experiments')
  }

  const duration = calculateDuration()
  const iceScore = calculateICEScore()

  if (initialLoading) {
    return (
      <div className="experiment-create-page">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="experiment-create-page">
      <PageHeader
        title={isEditMode ? '실험 수정' : '새 실험 생성'}
        description="A/B 테스트 실험을 정의하고 관리합니다."
      />

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          {/* Section 1: 기본 정보 */}
          <div className="form-section">
            <h3 className="form-section-title">기본 정보</h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                실험 이름 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="예: 프리미엄 전환 CTA 버튼 색상 테스트"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">실험 설명</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="이 실험에 대한 간단한 설명을 입력하세요"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="owner" className="form-label">
                  담당자 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="team" className="form-label">팀</label>
                <select
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">선택하세요</option>
                  <option value="Data Team">Data Team</option>
                  <option value="Product Team">Product Team</option>
                  <option value="UX Team">UX Team</option>
                  <option value="Marketing Team">Marketing Team</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experiment_type" className="form-label">실험 유형</label>
                <select
                  id="experiment_type"
                  name="experiment_type"
                  value={formData.experiment_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="A/B Test">A/B Test</option>
                  <option value="Multivariate Test">Multivariate Test</option>
                  <option value="Marketing Campaign">Marketing Campaign</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">실험 상태</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="draft">Draft (초안)</option>
                  <option value="ready">Ready (준비 완료)</option>
                  <option value="running">Running (실행 중)</option>
                  <option value="analyzing">Analyzing (분석 중)</option>
                  <option value="complete">Complete (완료)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: 목표 및 가설 */}
          <div className="form-section">
            <h3 className="form-section-title">목표 및 가설</h3>

            <div className="form-group">
              <label htmlFor="objective" className="form-label">
                실험 목표 <span className="required">*</span>
              </label>
              <select
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">선택하세요</option>
                <option value="첫 구매 전환">첫 구매 전환</option>
                <option value="재구매 촉진">재구매 촉진</option>
                <option value="이탈 방지">이탈 방지</option>
                <option value="프리미엄 전환">프리미엄 전환</option>
                <option value="구매 전환">구매 전환</option>
                <option value="장바구니 추가율">장바구니 추가율</option>
                <option value="사용자 참여">사용자 참여</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hypothesis" className="form-label">
                가설 서술 <span className="required">*</span>
              </label>
              <textarea
                id="hypothesis"
                name="hypothesis"
                value={formData.hypothesis}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="예: CTA 버튼 색상을 더 눈에 띄는 색으로 변경하면 사용자의 주의를 끌어 전환율이 향상될 것이다"
                required
              />
              <div className="form-helper-text">
                이 실험을 통해 무엇을 검증하고자 하는지 명확히 서술하세요.
              </div>
            </div>

            <div className="ice-scores-section">
              <div className="ice-scores-header">
                <label className="form-label">ICE 점수 (선택사항)</label>
                {iceScore && (
                  <div className="ice-total-score">
                    총점: <span className="ice-score-value">{iceScore}</span>
                  </div>
                )}
              </div>
              <div className="form-row ice-scores-grid">
                <div className="form-group">
                  <label htmlFor="ice_impact" className="form-label">Impact (영향도)</label>
                  <input
                    type="number"
                    id="ice_impact"
                    name="ice_impact"
                    value={formData.ice_impact || ''}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="10"
                    placeholder="1-10"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ice_confidence" className="form-label">Confidence (확신도)</label>
                  <input
                    type="number"
                    id="ice_confidence"
                    name="ice_confidence"
                    value={formData.ice_confidence || ''}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="10"
                    placeholder="1-10"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ice_ease" className="form-label">Ease (용이성)</label>
                  <input
                    type="number"
                    id="ice_ease"
                    name="ice_ease"
                    value={formData.ice_ease || ''}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="10"
                    placeholder="1-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 메트릭 선택 */}
          <div className="form-section">
            <h3 className="form-section-title">메트릭 선택</h3>

            <div className="form-group">
              <label className="form-label">
                핵심 지표 <span className="required">*</span>
              </label>
              {selectedPrimaryMetric ? (
                <div className="selected-item-box">
                  <div className="selected-item-info">
                    <div className="selected-item-name">{selectedPrimaryMetric.name}</div>
                    <div className="selected-item-description">{selectedPrimaryMetric.description}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-change"
                    onClick={openPrimaryMetricModal}
                  >
                    변경
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-select"
                  onClick={openPrimaryMetricModal}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  핵심 지표 선택
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">보조 지표 (최대 3개)</label>
              {selectedSecondaryMetrics.length > 0 && (
                <div className="selected-metrics-list">
                  {selectedSecondaryMetrics.map((metric) => (
                    <div key={metric.id} className="selected-metric-item">
                      <div className="selected-metric-info">
                        <div className="selected-metric-name">{metric.name}</div>
                        <div className="selected-metric-description">{metric.description}</div>
                      </div>
                      <button
                        type="button"
                        className="remove-metric-btn"
                        onClick={() => handleRemoveSecondaryMetric(metric.id)}
                        title="제거"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="btn-select"
                onClick={openSecondaryMetricModal}
                disabled={selectedSecondaryMetrics.length >= 3}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                보조 지표 선택
              </button>
            </div>
          </div>

          {/* Section 4: 실험 기간 및 대상 */}
          <div className="form-section">
            <h3 className="form-section-title">실험 기간 및 대상</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date" className="form-label">
                  시작일 <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date" className="form-label">
                  종료일 <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {duration && (
              <div className="duration-display">
                예상 실험 기간: <strong>{duration}일</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                대상 세그먼트 <span className="required">*</span>
              </label>
              {selectedSegment ? (
                <div className="selected-item-box">
                  <div className="selected-item-info">
                    <div className="selected-item-name">{selectedSegment.name}</div>
                    <div className="selected-item-description">{selectedSegment.description}</div>
                    <div className="selected-item-meta">
                      고객 수: {selectedSegment.customer_count?.toLocaleString() || 0}명
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-change"
                    onClick={() => setIsSegmentModalOpen(true)}
                  >
                    변경
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-select"
                  onClick={() => setIsSegmentModalOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  세그먼트 선택
                </button>
              )}
            </div>
          </div>

          {/* Section 5: 실험 변수 (Variants) */}
          <div className="form-section">
            <h3 className="form-section-title">실험 변수 (Variants)</h3>
            <p className="form-helper-text">
              실험에서 비교할 변수들을 정의하세요. 트래픽 할당의 합계는 100%여야 합니다.
            </p>
            <VariantsBuilder
              variants={formData.variants}
              onChange={handleVariantsChange}
            />
          </div>

          {/* Section 6: 추가 정보 */}
          <div className="form-section">
            <h3 className="form-section-title">추가 정보 (선택사항)</h3>

            <div className="form-group">
              <label htmlFor="conditions" className="form-label">실험 조건</label>
              <textarea
                id="conditions"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="예: 20% 할인 쿠폰, 24시간 유효"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confounding_factors" className="form-label">교란 요소</label>
              <textarea
                id="confounding_factors"
                name="confounding_factors"
                value={formData.confounding_factors}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="예상되는 외부 요인이나 교란 요소를 입력하세요"
              />
              <div className="form-helper-text">
                실험 결과에 영향을 줄 수 있는 외부 요인들을 기록하세요.
              </div>
            </div>
          </div>

          {/* 폼 액션 */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isEditMode ? '수정 중...' : '생성 중...') : (isEditMode ? '실험 수정' : '실험 생성')}
            </button>
          </div>
        </form>
      </div>

      {/* 모달들 */}
      <MetricSelectModal
        isOpen={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
        onSelect={handleMetricSelect}
        selectedMetrics={metricModalMode === 'primary'
          ? (selectedPrimaryMetric ? [selectedPrimaryMetric] : [])
          : selectedSecondaryMetrics
        }
        singleSelect={metricModalMode === 'primary'}
      />

      <SegmentSelectModal
        isOpen={isSegmentModalOpen}
        onClose={() => setIsSegmentModalOpen(false)}
        onSelect={handleSegmentSelect}
        selectedSegmentId={selectedSegment?.id}
      />
    </div>
  )
}

export default ExperimentCreate
