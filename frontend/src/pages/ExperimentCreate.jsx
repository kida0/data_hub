import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SegmentSelectModal from '../components/SegmentSelectModal'
import MetricCategoryModal from '../components/MetricCategoryModal'
import VariantsBuilder from '../components/VariantsBuilder'
import InfoTooltip from '../components/InfoTooltip'
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
    team: 'Product Team',
    experiment_type: 'A/B Test',
    status: 'draft',
    objective: '',
    background: '',
    hypothesis: '',
    expected_impact: '',
    experiment_unit: 'User',
    test_type: '',
    significance_level: 0.05,
    statistical_power: 0.8,
    minimum_detectable_effect: '',
    sample_size: '',
    start_date: '',
    end_date: '',
    target_segment_id: null,
    variants: [
      { name: 'Control', description: '', traffic_allocation: 50 },
      { name: 'Variant A', description: '', traffic_allocation: 50 }
    ]
  })

  const [categorizedMetrics, setCategorizedMetrics] = useState({
    primary: [],
    secondary: [],
    guardrail: []
  })
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false)
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(isEditMode)

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

      const variants = experiment.variants ? JSON.parse(experiment.variants) : []

      // 메트릭 ID 파싱
      const primaryMetricIds = experiment.primary_metric_ids
        ? JSON.parse(experiment.primary_metric_ids)
        : []
      const secondaryMetricIds = experiment.secondary_metric_ids
        ? JSON.parse(experiment.secondary_metric_ids)
        : []
      const guardrailMetricIds = experiment.guardrail_metric_ids
        ? JSON.parse(experiment.guardrail_metric_ids)
        : []

      setFormData({
        name: experiment.name || '',
        description: experiment.description || '',
        owner: experiment.owner || '',
        team: experiment.team || 'Product Team',
        experiment_type: experiment.experiment_type || 'A/B Test',
        status: experiment.status || 'draft',
        objective: experiment.objective || '',
        background: experiment.background || '',
        hypothesis: experiment.hypothesis || '',
        expected_impact: experiment.expected_impact || '',
        experiment_unit: experiment.experiment_unit || 'User',
        significance_level: experiment.significance_level || 0.05,
        statistical_power: experiment.statistical_power || 0.8,
        minimum_detectable_effect: experiment.minimum_detectable_effect || '',
        sample_size: experiment.sample_size || '',
        start_date: experiment.start_date || '',
        end_date: experiment.end_date || '',
        target_segment_id: experiment.target_segment_id,
        variants: variants
      })

      // 세그먼트 로드
      if (experiment.target_segment_id) {
        const segmentResponse = await segmentsAPI.getById(experiment.target_segment_id)
        setSelectedSegment(segmentResponse.data)
      }

      // 메트릭 로드
      const metricsResponse = await metricsAPI.getAll()
      const allMetrics = metricsResponse.data.items

      const loadedMetrics = {
        primary: allMetrics.filter(m => primaryMetricIds.includes(m.id)),
        secondary: allMetrics.filter(m => secondaryMetricIds.includes(m.id)),
        guardrail: allMetrics.filter(m => guardrailMetricIds.includes(m.id))
      }
      setCategorizedMetrics(loadedMetrics)

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

  const handleMetricsSave = (metrics) => {
    setCategorizedMetrics(metrics)
  }

  const handleSegmentSelect = (segment) => {
    setSelectedSegment(segment)
    setFormData((prev) => ({
      ...prev,
      target_segment_id: segment ? segment.id : null
    }))
  }

  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date) return null
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : null
  }

  const isValidTraffic = () => {
    const total = formData.variants.reduce((sum, v) => sum + (Number(v.traffic_allocation) || 0), 0)
    return total === 100
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.owner || !formData.objective || !formData.hypothesis || !formData.background) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    if (categorizedMetrics.primary.length === 0) {
      setError('주요 지표를 최소 1개 선택해주세요.')
      return
    }

    if (!formData.target_segment_id) {
      setError('대상 세그먼트를 선택해주세요.')
      return
    }

    // 수정 모드에서만 실험 그룹 관련 검증 수행
    if (isEditMode) {
      if (!isValidTraffic()) {
        setError('할당량의 합계가 100%가 되어야 합니다.')
        return
      }

      if (formData.variants.length < 2) {
        setError('대조군과 1개 이상의 실험군이 필요합니다.')
        return
      }
    }

    try {
      setLoading(true)

      const experimentData = {
        ...formData,
        variants: JSON.stringify(formData.variants),
        primary_metric_ids: JSON.stringify(categorizedMetrics.primary.map(m => m.id)),
        secondary_metric_ids: JSON.stringify(categorizedMetrics.secondary.map(m => m.id)),
        guardrail_metric_ids: JSON.stringify(categorizedMetrics.guardrail.map(m => m.id)),
        significance_level: formData.significance_level ? Number(formData.significance_level) : null,
        statistical_power: formData.statistical_power ? Number(formData.statistical_power) : null,
        description: formData.description || null
      }

      if (isEditMode) {
        await experimentsAPI.update(id, experimentData)
      } else {
        await experimentsAPI.create(experimentData)
      }
      navigate('/experiments')
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} experiment:`, err)
      let errorMessage = isEditMode ? '실험 수정에 실패했습니다.' : '실험 생성에 실패했습니다.'

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail
        } else if (Array.isArray(err.response.data.detail)) {
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

          {/* 기본 정보 */}
          <div className="form-section">
            <h3 className="form-section-title">기본 정보</h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                실험명 <span className="required">*</span>
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
              <label htmlFor="owner" className="form-label">
                실험 담당자 <span className="required">*</span>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  실험 상태 <span className="required">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  disabled={!isEditMode}
                >
                  <option value="draft">Draft (초안)</option>
                  <option value="ready">Ready (준비 완료)</option>
                  <option value="running">Running (실행 중)</option>
                  <option value="analyzing">Analyzing (분석 중)</option>
                  <option value="complete">Complete (완료)</option>
                </select>
              </div>

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
            </div>
          </div>

          {/* 실험 계획 */}
          <div className="form-section">
            <h3 className="form-section-title">실험 계획</h3>

            <div className="form-group">
              <label htmlFor="background" className="form-label-with-tooltip">
                <span>
                  실험 배경 <span className="required">*</span>
                </span>
                <InfoTooltip
                  title="실험 배경"
                  description="비즈니스 문제와 실험의 필요성을 명확히 하면, 팀원들이 실험의 우선순위와 중요성을 이해하고, 실험 결과를 비즈니스 의사결정에 연결할 수 있습니다."
                  example="현재 프리미엄 전환율이 2.5%로 업계 평균 4%보다 낮은 상황입니다. 사용자 인터뷰 결과, CTA 버튼이 눈에 잘 띄지 않는다는 피드백이 많았습니다."
                  checklist={[
                    '현재 어떤 문제가 있나요?',
                    '문제의 영향은 얼마나 큰가요? (정량적으로)',
                    '왜 지금 이 문제를 해결해야 하나요?'
                  ]}
                />
              </label>
              <textarea
                id="background"
                name="background"
                value={formData.background}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="왜 이 실험을 하나요? 어떤 비즈니스 문제를 해결하고자 하나요?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hypothesis" className="form-label-with-tooltip">
                <span>
                  가설 <span className="required">*</span>
                </span>
                <InfoTooltip
                  title="가설"
                  description="명확한 가설이 있으면 실험의 성공/실패를 객관적으로 판단할 수 있고, 학습한 내용을 다음 실험에 활용할 수 있습니다."
                  example="CTA 버튼 색상을 현재의 회색(#E5E8EB)에서 브랜드 컬러인 남색(#020760)으로 변경하면, 버튼의 시각적 강조도가 높아져 프리미엄 전환율이 15% 이상 증가할 것이다."
                  checklist={[
                    '무엇을 변경하나요? (구체적으로)',
                    '왜 이 변경이 효과가 있을 것이라고 생각하나요?',
                    '어떤 결과를 기대하나요? (정량적으로)'
                  ]}
                />
              </label>
              <textarea
                id="hypothesis"
                name="hypothesis"
                value={formData.hypothesis}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="무엇을 변경했을 때 어떤 결과가 나오길 기대하나요?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expected_impact" className="form-label-with-tooltip">
                <span>예상 효과</span>
                <InfoTooltip
                  title="예상 효과"
                  description="정량적 목표를 설정하면 실험의 성공 기준이 명확해지고, 실험 종료 후 결과를 객관적으로 평가할 수 있습니다."
                  example="프리미엄 전환율 15% 증가 (현재 2.5% → 목표 2.9%), 월 추가 매출 $50,000 예상"
                  checklist={[
                    '핵심 지표가 얼마나 개선될 것으로 예상하나요?',
                    '비즈니스 임팩트는 어느 정도인가요? (매출, 사용자 수 등)'
                  ]}
                />
              </label>
              <textarea
                id="expected_impact"
                name="expected_impact"
                value={formData.expected_impact}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="정량적 목표가 있나요? (예: 전환율 15% 증가)"
              />
            </div>

            <div className="form-group">
              <label className="form-label-with-tooltip">
                <span>
                  실험 대상 <span className="required">*</span>
                </span>
                <InfoTooltip
                  title="실험 대상"
                  description="올바른 세그먼트를 선택하면 실험 결과의 신뢰도가 높아지고, 타겟 사용자에게 맞는 최적화를 할 수 있습니다."
                  example="'신규 가입 후 7일 이내 사용자' 세그먼트를 선택하여, 온보딩 개선 효과를 측정"
                  checklist={[
                    '실험 가설과 가장 관련 있는 사용자 그룹은 누구인가요?',
                    '이 세그먼트의 규모가 통계적으로 유의미한 결과를 얻기에 충분한가요?'
                  ]}
                />
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

            <div className="form-group">
              <label className="form-label-with-tooltip">
                <span>
                  측정 지표 <span className="required">*</span>
                </span>
                <InfoTooltip
                  title="측정 지표"
                  description="명확한 지표 분류로 실험의 성공/실패를 객관적으로 판단하고, 의도하지 않은 부작용을 조기에 발견할 수 있습니다."
                  example="주요 지표: 프리미엄 전환율 | 보조 지표: 페이지 체류 시간, 클릭률 | 가드레일: 이탈률, 고객 만족도"
                  checklist={[
                    '주요 지표: 의사결정의 핵심이 되는 1~2개 지표를 선택했나요?',
                    '보조 지표: 추가로 관찰하고 싶은 지표가 있나요?',
                    '가드레일 지표: 악화되면 안 되는 지표를 설정했나요?'
                  ]}
                />
              </label>

              {(categorizedMetrics.primary.length > 0 ||
                categorizedMetrics.secondary.length > 0 ||
                categorizedMetrics.guardrail.length > 0) ? (
                <div className="selected-metrics-container">
                  <div className="selected-metrics-display">
                    {categorizedMetrics.primary.length > 0 && (
                      <div className="metrics-category-group">
                        <div className="metrics-category-header">
                          <span className="metrics-category-label primary">주요 지표</span>
                          <span className="metrics-category-count">{categorizedMetrics.primary.length}개</span>
                        </div>
                        <div className="metrics-list">
                          {categorizedMetrics.primary.map((metric) => (
                            <div key={metric.id} className="metric-item">
                              <span className="metric-name">{metric.name}</span>
                              {metric.description && (
                                <span className="metric-description">{metric.description}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {categorizedMetrics.secondary.length > 0 && (
                      <div className="metrics-category-group">
                        <div className="metrics-category-header">
                          <span className="metrics-category-label secondary">보조 지표</span>
                          <span className="metrics-category-count">{categorizedMetrics.secondary.length}개</span>
                        </div>
                        <div className="metrics-list">
                          {categorizedMetrics.secondary.map((metric) => (
                            <div key={metric.id} className="metric-item">
                              <span className="metric-name">{metric.name}</span>
                              {metric.description && (
                                <span className="metric-description">{metric.description}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {categorizedMetrics.guardrail.length > 0 && (
                      <div className="metrics-category-group">
                        <div className="metrics-category-header">
                          <span className="metrics-category-label guardrail">가드레일 지표</span>
                          <span className="metrics-category-count">{categorizedMetrics.guardrail.length}개</span>
                        </div>
                        <div className="metrics-list">
                          {categorizedMetrics.guardrail.map((metric) => (
                            <div key={metric.id} className="metric-item">
                              <span className="metric-name">{metric.name}</span>
                              {metric.description && (
                                <span className="metric-description">{metric.description}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-change"
                    onClick={() => setIsMetricModalOpen(true)}
                  >
                    변경
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-select"
                  onClick={() => setIsMetricModalOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  측정 지표 선택
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">실험 기간</label>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date" className="form-label">
                    시작일
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date" className="form-label">
                    종료일
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {duration && (
                <div className="duration-display">
                  예상 실험 기간: <strong>{duration}일</strong>
                </div>
              )}
            </div>
          </div>

          {/* 데이터팀 입력 필드 - 수정 모드에서만 표시 */}
          {isEditMode && (
            <div className="form-section">
              <h3 className="form-section-title">데이터팀 입력 필드</h3>
              <div className="info-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                아래 필드는 데이터팀이 입력합니다.
              </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experiment_type" className="form-label">실험 타입</label>
                <select
                  id="experiment_type"
                  name="experiment_type"
                  value={formData.experiment_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="A/B Test">A/B Test</option>
                  <option value="A/B/n Test">A/B/n Test</option>
                  <option value="Multivariate Test">Multivariate Test (MVT)</option>
                  <option value="Split URL Test">Split URL Test</option>
                  <option value="Multi-Armed Bandit">Multi-Armed Bandit</option>
                  <option value="Sequential Test">Sequential Test</option>
                  <option value="Holdout Test">Holdout Test</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experiment_unit" className="form-label">실험 단위</label>
                <select
                  id="experiment_unit"
                  name="experiment_unit"
                  value={formData.experiment_unit}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="User">User (유저 단위)</option>
                  <option value="Session">Session (세션 단위)</option>
                  <option value="Device">Device (디바이스 단위)</option>
                  <option value="Page View">Page View (페이지뷰 단위)</option>
                </select>
              </div>
            </div>

            <div className="statistical-design-subsection">
              <h4 className="subsection-title">통계적 설계</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="significance_level" className="form-label">유의수준 (α)</label>
                  <input
                    type="number"
                    id="significance_level"
                    name="significance_level"
                    value={formData.significance_level}
                    onChange={handleChange}
                    className="form-input"
                    step="0.01"
                    min="0.01"
                    max="0.1"
                    placeholder="0.05"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="statistical_power" className="form-label">검정력 (1-β)</label>
                  <input
                    type="number"
                    id="statistical_power"
                    name="statistical_power"
                    value={formData.statistical_power}
                    onChange={handleChange}
                    className="form-input"
                    step="0.05"
                    min="0.5"
                    max="0.99"
                    placeholder="0.8"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minimum_detectable_effect" className="form-label">최소감지효과 (MDE)</label>
                  <input
                    type="number"
                    id="minimum_detectable_effect"
                    name="minimum_detectable_effect"
                    value={formData.minimum_detectable_effect}
                    onChange={handleChange}
                    className="form-input"
                    step="0.01"
                    min="0.01"
                    max="1"
                    placeholder="0.05"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sample_size" className="form-label">샘플 크기</label>
                  <input
                    type="text"
                    id="sample_size"
                    name="sample_size"
                    value={formData.sample_size}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="예: 10000"
                  />
                </div>
              </div>
            </div>
            </div>
          )}

          {/* 실험 그룹 구성 - 수정 모드에서만 표시 */}
          {isEditMode && (
            <div className="form-section">
            <h3 className="form-section-title">
              실험 그룹 구성
            </h3>
            <div className="form-group">
              <label className="form-label">
                Variants <span className="required">*</span>
              </label>
              <VariantsBuilder
                variants={formData.variants}
                onChange={handleVariantsChange}
              />
            </div>
            </div>
          )}

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
      <MetricCategoryModal
        isOpen={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
        onSave={handleMetricsSave}
        initialMetrics={categorizedMetrics}
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
