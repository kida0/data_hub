import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import Badge from '../components/Badge'
import { experimentsAPI, metricsAPI, segmentsAPI } from '../services/api'
import './ExperimentDetail.css'

function ExperimentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [experiment, setExperiment] = useState(null)
  const [segment, setSegment] = useState(null)
  const [metrics, setMetrics] = useState({
    primary: [],
    secondary: [],
    guardrail: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExperiment()
  }, [id])

  const fetchExperiment = async () => {
    try {
      setLoading(true)
      const response = await experimentsAPI.getById(id)
      const experimentData = response.data
      setExperiment(experimentData)

      // 세그먼트 정보 로드
      if (experimentData.target_segment_id) {
        try {
          const segmentResponse = await segmentsAPI.getById(experimentData.target_segment_id)
          setSegment(segmentResponse.data)
        } catch (err) {
          console.error('Error loading segment:', err)
        }
      }

      // 메트릭 정보 로드
      const primaryIds = experimentData.primary_metric_ids
        ? JSON.parse(experimentData.primary_metric_ids)
        : []
      const secondaryIds = experimentData.secondary_metric_ids
        ? JSON.parse(experimentData.secondary_metric_ids)
        : []
      const guardrailIds = experimentData.guardrail_metric_ids
        ? JSON.parse(experimentData.guardrail_metric_ids)
        : []

      if (primaryIds.length > 0 || secondaryIds.length > 0 || guardrailIds.length > 0) {
        try {
          const metricsResponse = await metricsAPI.getAll()
          const allMetrics = metricsResponse.data.items

          setMetrics({
            primary: allMetrics.filter(m => primaryIds.includes(m.id)),
            secondary: allMetrics.filter(m => secondaryIds.includes(m.id)),
            guardrail: allMetrics.filter(m => guardrailIds.includes(m.id))
          })
        } catch (err) {
          console.error('Error loading metrics:', err)
        }
      }

      setError(null)
    } catch (err) {
      console.error('Error fetching experiment:', err)
      setError('실험을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="experiment-detail-page">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  if (error || !experiment) {
    return (
      <div className="experiment-detail-page">
        <div className="error-message">{error || '실험을 찾을 수 없습니다.'}</div>
      </div>
    )
  }

  // Variants 파싱
  const variants = experiment.variants ? JSON.parse(experiment.variants) : []

  // 상태에 따른 배지 variant
  const getStatusVariant = (status) => {
    const statusMap = {
      'draft': 'draft',
      'ready': 'info',
      'running': 'running',
      'analyzing': 'analyzing',
      'complete': 'completed'
    }
    return statusMap[status] || 'info'
  }

  // 상태 한글 표시
  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Draft (초안)',
      'ready': 'Ready (준비 완료)',
      'running': 'Running (실행 중)',
      'analyzing': 'Analyzing (분석 중)',
      'complete': 'Complete (완료)'
    }
    return statusMap[status] || status
  }

  // 실험 기간 계산
  const calculateDuration = () => {
    if (!experiment.start_date || !experiment.end_date) return null
    const start = new Date(experiment.start_date)
    const end = new Date(experiment.end_date)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : null
  }

  const duration = calculateDuration()

  return (
    <div className="experiment-detail-page">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: 'Experiments', onClick: () => navigate('/experiments') },
          { label: experiment.name, active: true }
        ]}
      />

      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-top">
          <div>
            <h1 className="detail-title">{experiment.name}</h1>
            {experiment.description && (
              <p className="detail-subtitle">{experiment.description}</p>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/experiments/${id}/edit`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            수정
          </button>
        </div>
        <div className="detail-header-meta">
          <Badge variant={getStatusVariant(experiment.status)}>
            {getStatusText(experiment.status)}
          </Badge>
          <span className="meta-divider">|</span>
          <span className="meta-item">
            <strong>목표:</strong> {experiment.objective}
          </span>
          <span className="meta-divider">|</span>
          <span className="meta-item">
            <strong>담당:</strong> {experiment.owner} ({experiment.team})
          </span>
          <span className="meta-divider">|</span>
          <span className="meta-item">
            <strong>유형:</strong> {experiment.experiment_type}
          </span>
          <span className="meta-divider">|</span>
          <span className="meta-item">
            <strong>단위:</strong> {experiment.experiment_unit || 'User'}
          </span>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="detail-content">
        {/* Left Column - 실험 계획 */}
        <div className="detail-main-column">

          {/* 실험 배경 & 가설 */}
          <div className="section-block">
            <div className="section-header">
              <h2 className="section-title">실험 계획</h2>
            </div>

            <div className="plan-item">
              <div className="plan-label">배경</div>
              <div className="plan-content">{experiment.background || '배경 정보 없음'}</div>
            </div>

            <div className="plan-item highlight">
              <div className="plan-label">가설</div>
              <div className="plan-content">{experiment.hypothesis}</div>
            </div>

            {experiment.expected_impact && (
              <div className="plan-item">
                <div className="plan-label">예상 효과</div>
                <div className="plan-content">{experiment.expected_impact}</div>
              </div>
            )}
          </div>

          {/* 실험 대상 */}
          <div className="section-block">
            <div className="section-header">
              <h2 className="section-title">실험 대상</h2>
            </div>
            {segment ? (
              <div className="segment-box">
                <div className="segment-box-header">
                  <span className="segment-box-name">{segment.name}</span>
                  <span className="segment-box-count">{segment.customer_count?.toLocaleString() || 0}명</span>
                </div>
                {segment.description && (
                  <div className="segment-box-desc">{segment.description}</div>
                )}
              </div>
            ) : (
              <div className="empty-box">세그먼트 정보 없음</div>
            )}
          </div>

          {/* 측정 지표 */}
          <div className="section-block">
            <div className="section-header">
              <h2 className="section-title">측정 지표</h2>
            </div>

            {metrics.primary.length > 0 && (
              <div className="metrics-group">
                <div className="metrics-group-label primary">
                  주요 지표 <span className="count">({metrics.primary.length})</span>
                </div>
                <div className="metrics-list">
                  {metrics.primary.map((metric, index) => (
                    <div key={metric.id} className="metric-item">
                      <span className="metric-number">{index + 1}.</span>
                      <div className="metric-info">
                        <div className="metric-name">{metric.name}</div>
                        {metric.description && (
                          <div className="metric-desc">{metric.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metrics.secondary.length > 0 && (
              <div className="metrics-group">
                <div className="metrics-group-label secondary">
                  보조 지표 <span className="count">({metrics.secondary.length})</span>
                </div>
                <div className="metrics-list">
                  {metrics.secondary.map((metric, index) => (
                    <div key={metric.id} className="metric-item">
                      <span className="metric-number">{index + 1}.</span>
                      <div className="metric-info">
                        <div className="metric-name">{metric.name}</div>
                        {metric.description && (
                          <div className="metric-desc">{metric.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metrics.guardrail.length > 0 && (
              <div className="metrics-group">
                <div className="metrics-group-label guardrail">
                  가드레일 지표 <span className="count">({metrics.guardrail.length})</span>
                </div>
                <div className="metrics-list">
                  {metrics.guardrail.map((metric, index) => (
                    <div key={metric.id} className="metric-item">
                      <span className="metric-number">{index + 1}.</span>
                      <div className="metric-info">
                        <div className="metric-name">{metric.name}</div>
                        {metric.description && (
                          <div className="metric-desc">{metric.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 실험 설정 */}
        <div className="detail-side-column">

          {/* 실험 기간 */}
          <div className="section-block compact">
            <div className="section-header">
              <h2 className="section-title">실험 기간</h2>
            </div>
            <div className="period-compact">
              <div className="period-compact-row">
                <span className="period-compact-label">시작</span>
                <span className="period-compact-value">{experiment.start_date || '미정'}</span>
              </div>
              <div className="period-compact-row">
                <span className="period-compact-label">종료</span>
                <span className="period-compact-value">{experiment.end_date || '미정'}</span>
              </div>
              {duration && (
                <div className="period-compact-row highlight">
                  <span className="period-compact-label">기간</span>
                  <span className="period-compact-value">{duration}일</span>
                </div>
              )}
            </div>
          </div>

          {/* 실험 그룹 구성 */}
          {variants.length > 0 && (
            <div className="section-block compact">
              <div className="section-header">
                <h2 className="section-title">실험 그룹</h2>
              </div>
              <div className="variants-compact">
                {variants.map((variant, index) => (
                  <div key={index} className="variant-row">
                    <div className="variant-row-header">
                      <span className="variant-row-name">{variant.name}</span>
                      <span className="variant-row-percent">{variant.traffic_allocation}%</span>
                    </div>
                    {variant.description && (
                      <div className="variant-row-desc">{variant.description}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Traffic Bar */}
              <div className="traffic-bar-compact">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="traffic-segment-compact"
                    style={{
                      width: `${variant.traffic_allocation}%`,
                      backgroundColor: index === 0 ? '#8b95a1' : `hsl(${210 + index * 30}, 70%, 60%)`
                    }}
                    title={`${variant.name}: ${variant.traffic_allocation}%`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 통계적 설계 */}
          <div className="section-block compact">
            <div className="section-header">
              <h2 className="section-title">통계적 설계</h2>
            </div>
            <div className="stats-compact">
              <div className="stats-compact-row">
                <span className="stats-compact-label">유의수준 (α)</span>
                <span className="stats-compact-value">{experiment.significance_level || 0.05}</span>
              </div>
              <div className="stats-compact-row">
                <span className="stats-compact-label">검정력 (1-β)</span>
                <span className="stats-compact-value">{experiment.statistical_power || 0.8}</span>
              </div>
              {experiment.minimum_detectable_effect && (
                <div className="stats-compact-row">
                  <span className="stats-compact-label">MDE</span>
                  <span className="stats-compact-value">{experiment.minimum_detectable_effect}</span>
                </div>
              )}
              {experiment.sample_size && (
                <div className="stats-compact-row">
                  <span className="stats-compact-label">샘플 크기</span>
                  <span className="stats-compact-value">{experiment.sample_size?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperimentDetail
