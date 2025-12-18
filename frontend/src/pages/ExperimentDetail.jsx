import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import PageHeader from '../components/PageHeader'
import CollapsibleSection from '../components/CollapsibleSection'
import Badge from '../components/Badge'
import { experimentsAPI } from '../services/api'
import './ExperimentDetail.css'

function ExperimentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [experiment, setExperiment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExperiment()
  }, [id])

  const fetchExperiment = async () => {
    try {
      setLoading(true)
      const response = await experimentsAPI.getById(id)
      setExperiment(response.data)
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

  // Secondary metrics 파싱
  const secondaryMetricIds = experiment.secondary_metric_ids
    ? JSON.parse(experiment.secondary_metric_ids)
    : []

  // ICE 총점 계산
  const iceTotal = (experiment.ice_impact || 0) + (experiment.ice_confidence || 0) + (experiment.ice_ease || 0)

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
      <PageHeader
        title={experiment.name}
        subtitle={experiment.description}
        actions={
          <>
            <button className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              실험 완료
            </button>
            <button className="btn btn-primary" onClick={() => navigate(`/experiments/${id}/edit`)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              수정
            </button>
          </>
        }
      >
        <div className="goal-tag">목표: {experiment.objective}</div>
      </PageHeader>

      {/* Basic Info Cards */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">담당자</div>
          <div className="info-value">
            <div className="owner-info">
              <div className="owner-avatar">{experiment.owner?.substring(0, 1) || 'U'}</div>
              <div className="owner-details">
                <div className="owner-name">{experiment.owner}</div>
                <div className="owner-role">{experiment.team || 'Team'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">실험 유형</div>
          <div className="info-value">
            <span className="experiment-type-badge">{experiment.experiment_type}</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">진행 상태</div>
          <div className="info-value">
            <Badge variant={getStatusVariant(experiment.status)}>
              {getStatusText(experiment.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="detail-section">
        <div className="section-title">상세 정보</div>
        <div className="detail-grid-3col">
          <div className="detail-item">
            <div className="detail-label">실험 기간</div>
            <div className="detail-value">
              {experiment.start_date} ~ {experiment.end_date}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">통계적 신뢰도</div>
            <div className="detail-value">{experiment.statistical_significance}%</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">통계적 검증력</div>
            <div className="detail-value">{experiment.statistical_power}%</div>
          </div>
        </div>
        <div className="detail-grid-3col" style={{ marginTop: '20px' }}>
          <div className="detail-item">
            <div className="detail-label">MDE (최소 감지 효과)</div>
            <div className="detail-value">{experiment.minimum_detectable_effect}%</div>
          </div>
          {iceTotal > 0 && (
            <div className="detail-item">
              <div className="detail-label">ICE 총점</div>
              <div className="detail-value">
                {iceTotal}점
                <span className="ice-breakdown">
                  (I:{experiment.ice_impact} C:{experiment.ice_confidence} E:{experiment.ice_ease})
                </span>
              </div>
            </div>
          )}
          {experiment.progress !== null && experiment.progress > 0 && (
            <div className="detail-item">
              <div className="detail-label">진행률</div>
              <div className="detail-value">{experiment.progress}%</div>
            </div>
          )}
        </div>
      </div>

      {/* Hypothesis Section */}
      <CollapsibleSection title="가설" defaultExpanded={true}>
        <div className="hypothesis-content">
          {experiment.hypothesis}
        </div>
      </CollapsibleSection>

      {/* Variants Section */}
      <CollapsibleSection title="실험 변수 (Variants)" defaultExpanded={true}>
        <div className="variants-grid">
          {variants.map((variant, index) => (
            <div key={index} className="variant-detail-card">
              <div className="variant-detail-header">
                <div className="variant-detail-name">{variant.name}</div>
                <div className="variant-detail-allocation">{variant.traffic_allocation}%</div>
              </div>
              {variant.description && (
                <div className="variant-detail-description">{variant.description}</div>
              )}
            </div>
          ))}
        </div>

        {/* Traffic Distribution Visual */}
        <div className="traffic-distribution">
          <div className="traffic-label">트래픽 분배</div>
          <div className="traffic-bar">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="traffic-segment"
                style={{
                  width: `${variant.traffic_allocation}%`,
                  backgroundColor: index === 0 ? '#8b95a1' : `hsl(${210 + index * 30}, 70%, 60%)`
                }}
                title={`${variant.name}: ${variant.traffic_allocation}%`}
              >
                {variant.traffic_allocation >= 10 && (
                  <span className="traffic-label-text">{variant.traffic_allocation}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Metrics Section */}
      <CollapsibleSection title="측정 지표" defaultExpanded={true}>
        <div className="metrics-section">
          <div className="metric-item-detail">
            <div className="metric-label-detail">핵심 지표</div>
            <div className="metric-value-detail">
              <Badge variant="info">Metric ID: {experiment.primary_metric_id}</Badge>
            </div>
          </div>
          {secondaryMetricIds.length > 0 && (
            <div className="metric-item-detail">
              <div className="metric-label-detail">보조 지표</div>
              <div className="metric-value-detail">
                {secondaryMetricIds.map((metricId, index) => (
                  <Badge key={index} variant="category">Metric ID: {metricId}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Additional Information */}
      {(experiment.conditions || experiment.confounding_factors) && (
        <CollapsibleSection title="추가 정보" defaultExpanded={true}>
          {experiment.conditions && (
            <div className="info-item">
              <div className="info-item-label">실험 조건</div>
              <div className="info-item-content">{experiment.conditions}</div>
            </div>
          )}
          {experiment.confounding_factors && (
            <div className="info-item">
              <div className="info-item-label">교란 요소</div>
              <div className="info-item-content">{experiment.confounding_factors}</div>
            </div>
          )}
        </CollapsibleSection>
      )}
    </div>
  )
}

export default ExperimentDetail
