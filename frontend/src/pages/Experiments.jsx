import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import { experimentsAPI } from '../services/api'
import './Experiments.css'

function Experiments() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExperiments()
  }, [])

  const fetchExperiments = async () => {
    try {
      setLoading(true)
      const response = await experimentsAPI.getAll({ limit: 100 })
      setExperiments(response.data.items || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching experiments:', err)
      setError('실험 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 필터링된 실험 목록
  const filteredExperiments = activeTab === 'all'
    ? experiments
    : experiments.filter(exp => exp.status === activeTab)

  // 상태별로 그룹핑
  const statusGroups = {
    draft: experiments.filter(exp => exp.status === 'draft'),
    ready: experiments.filter(exp => exp.status === 'ready'),
    running: experiments.filter(exp => exp.status === 'running'),
    analyzing: experiments.filter(exp => exp.status === 'analyzing'),
    complete: experiments.filter(exp => exp.status === 'complete')
  }

  // 파이프라인 스테이지
  const pipelineStages = [
    {
      name: 'Draft',
      count: statusGroups.draft.length,
      items: statusGroups.draft.slice(0, 3).map(exp => ({
        id: exp.id,
        title: exp.name,
        meta: `${exp.owner} · ${new Date(exp.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}`
      }))
    },
    {
      name: 'Ready',
      count: statusGroups.ready.length,
      items: statusGroups.ready.slice(0, 3).map(exp => ({
        id: exp.id,
        title: exp.name,
        meta: `${exp.owner} · 승인 대기`
      }))
    },
    {
      name: 'Running',
      count: statusGroups.running.length,
      items: statusGroups.running.slice(0, 3).map(exp => {
        const today = new Date()
        const endDate = new Date(exp.end_date)
        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
        return {
          id: exp.id,
          title: exp.name,
          meta: `진행률 ${exp.progress || 0}% · D-${daysLeft > 0 ? daysLeft : 0}`
        }
      })
    },
    {
      name: 'Analyzing',
      count: statusGroups.analyzing.length,
      items: statusGroups.analyzing.slice(0, 3).map(exp => ({
        id: exp.id,
        title: exp.name,
        meta: '분석 중'
      }))
    },
    {
      name: 'Complete',
      count: statusGroups.complete.length,
      items: statusGroups.complete.slice(0, 3).map(exp => ({
        id: exp.id,
        title: exp.name,
        meta: '완료'
      }))
    }
  ]

  // 통계 계산
  const stats = [
    { label: '총 실험 수', value: experiments.length.toString(), change: '', type: 'neutral' },
    { label: '진행 중', value: statusGroups.running.length.toString(), change: '', type: 'neutral' },
    { label: '분석 중', value: statusGroups.analyzing.length.toString(), change: '', type: 'neutral' },
    { label: '완료', value: statusGroups.complete.length.toString(), change: '', type: 'neutral' }
  ]

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  }

  // 날짜 차이 계산 (D-day)
  const calculateDaysLeft = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  // 상태 텍스트
  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Draft (초안)',
      'ready': 'Ready (준비 완료)',
      'running': '실행 중',
      'analyzing': '분석 중',
      'complete': '완료'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="experiments-page">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="experiments-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="experiments-page">
      {/* Header */}
      <PageHeader
        title="Experiment"
        description="A/B 테스트와 실험을 관리하고 데이터 기반 의사결정을 내릴 수 있습니다."
        actions={
          <>
            <button className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              전체 리포트
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/experiments/new')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              새 실험
            </button>
          </>
        }
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changeType={stat.type}
          />
        ))}
      </div>

      {/* Experiment Pipeline */}
      <div className="pipeline-section">
        <div className="section-title">실험 파이프라인</div>
        <div className="pipeline">
          {pipelineStages.map((stage, index) => (
            <div key={index} className="pipeline-stage">
              <div className="stage-header">
                <div className="stage-name">{stage.name}</div>
                <div className="stage-count">{stage.count}</div>
              </div>
              <div className="stage-items">
                {stage.items.length > 0 ? (
                  stage.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="pipeline-item"
                      onClick={() => navigate(`/experiments/${item.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="pipeline-item-title">{item.title}</div>
                      <div className="pipeline-item-meta">{item.meta}</div>
                    </div>
                  ))
                ) : (
                  <div className="pipeline-empty">실험 없음</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Experiments */}
      <div className="experiments-section">
        <div className="section-header">
          <div className="section-title">실험 목록</div>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
            </button>
            <button
              className={`filter-tab ${activeTab === 'running' ? 'active' : ''}`}
              onClick={() => setActiveTab('running')}
            >
              실행 중
            </button>
            <button
              className={`filter-tab ${activeTab === 'analyzing' ? 'active' : ''}`}
              onClick={() => setActiveTab('analyzing')}
            >
              분석 중
            </button>
            <button
              className={`filter-tab ${activeTab === 'complete' ? 'active' : ''}`}
              onClick={() => setActiveTab('complete')}
            >
              완료
            </button>
          </div>
        </div>

        {filteredExperiments.length === 0 ? (
          <div className="no-experiments">
            실험이 없습니다.
          </div>
        ) : (
          filteredExperiments.map((exp) => {
            const daysLeft = calculateDaysLeft(exp.end_date)
            return (
              <div
                key={exp.id}
                className="experiment-card"
                onClick={() => navigate(`/experiments/${exp.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="experiment-header">
                  <div className="experiment-title-section">
                    <div className="experiment-title">{exp.name}</div>
                    <div className="experiment-meta">
                      <Badge variant="info">목표: {exp.objective || '없음'}</Badge>
                      <span>{exp.owner} · {exp.team || 'Team'}</span>
                      <span>{formatDate(exp.start_date)} - {formatDate(exp.end_date)}</span>
                    </div>
                  </div>
                  <Badge variant={exp.status}>{getStatusText(exp.status)}</Badge>
                </div>

                {exp.status === 'running' && exp.progress !== null && (
                  <div className="progress-section">
                    <div className="progress-label">
                      <span>진행률</span>
                      <span>{exp.progress}% (D-{daysLeft})</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${exp.progress}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="experiment-info">
                  <div className="info-item">
                    <span className="info-label">실험 유형:</span>
                    <span className="info-value">{exp.experiment_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">가설:</span>
                    <span className="info-value">{exp.hypothesis}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Experiments
