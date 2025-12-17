import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import './Experiments.css'

function Experiments() {
  const [activeTab, setActiveTab] = useState('all')

  const stats = [
    { label: '총 실험 수', value: '127', change: '+8 this month', type: 'positive' },
    { label: '진행 중', value: '12', change: 'across 4 teams', type: 'neutral' },
    { label: '성공률', value: '68%', change: '+5% vs last quarter', type: 'positive' },
    { label: '평균 실험 기간', value: '21일', change: '+3일 vs target', type: 'negative' }
  ]

  const pipelineStages = [
    {
      name: 'Draft',
      count: 8,
      items: [
        { title: '결제 페이지 간소화', meta: '키다 · 12월 10일' },
        { title: '푸시 알림 문구 최적화', meta: '민지 · 12월 9일' },
        { title: '홈 화면 레이아웃 변경', meta: '준호 · 12월 8일' }
      ]
    },
    {
      name: 'Ready',
      count: 5,
      items: [
        { title: '신규 가입 플로우 개선', meta: '수진 · 승인 대기' },
        { title: '검색 알고리즘 v2', meta: '현우 · 승인 대기' }
      ]
    },
    {
      name: 'Running',
      count: 12,
      items: [
        { title: '프리미엄 CTA 버튼 색상', meta: '진행률 45% · D-8' },
        { title: '상품 상세 이미지 크기', meta: '진행률 78% · D-3' },
        { title: '리뷰 노출 위치', meta: '진행률 23% · D-12' }
      ]
    },
    {
      name: 'Analyzing',
      count: 6,
      items: [
        { title: '장바구니 플로팅 버튼', meta: '분석 중 · 2일 전 종료' },
        { title: '추천 알고리즘 개선', meta: '분석 중 · 1일 전 종료' }
      ]
    },
    {
      name: 'Complete',
      count: 96,
      items: [
        { title: '신규 가입 쿠폰 (3일)', meta: '성공 · +35.8%' },
        { title: '무료 배송 문구 강조', meta: '성공 · +18.2%' }
      ]
    }
  ]

  const experiments = [
    {
      id: 1,
      title: '프리미엄 전환 CTA 버튼 색상 테스트',
      goal: '목표: 프리미엄 전환',
      owner: '키다 · Data Team',
      period: '12월 1일 - 12월 22일',
      status: 'running',
      statusText: '실행 중',
      progress: 45,
      daysLeft: 8,
      metrics: [
        { label: '전환율 (Control)', value: '3.2%' },
        { label: '전환율 (Variant A)', value: '3.8%', change: '+18.8%', changeType: 'positive' },
        { label: '표본 크기', value: '12,847' },
        { label: '통계적 신뢰도', value: '87%' }
      ]
    },
    {
      id: 2,
      title: '상품 상세 페이지 이미지 크기 최적화',
      goal: '목표: 구매 전환',
      owner: '민지 · Product Team',
      period: '11월 28일 - 12월 17일',
      status: 'running',
      statusText: '실행 중',
      progress: 78,
      daysLeft: 3,
      metrics: [
        { label: '전환율 (Control)', value: '8.4%' },
        { label: '전환율 (Variant A)', value: '9.1%', change: '+8.3%', changeType: 'positive' },
        { label: '표본 크기', value: '24,582' },
        { label: '통계적 신뢰도', value: '94%' }
      ]
    },
    {
      id: 3,
      title: '장바구니 플로팅 버튼 추가',
      goal: '목표: 장바구니 추가율',
      owner: '준호 · UX Team',
      period: '11월 18일 - 12월 8일 (종료)',
      status: 'analyzing',
      statusText: '분석 중',
      metrics: [
        { label: '추가율 (Control)', value: '12.8%' },
        { label: '추가율 (Variant A)', value: '15.2%', change: '+18.8%', changeType: 'positive' },
        { label: '표본 크기', value: '31,248' },
        { label: '통계적 신뢰도', value: '96%' }
      ]
    }
  ]

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
            <button className="btn btn-primary">
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
                {stage.items.map((item, idx) => (
                  <div key={idx} className="pipeline-item">
                    <div className="pipeline-item-title">{item.title}</div>
                    <div className="pipeline-item-meta">{item.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Experiments */}
      <div className="experiments-section">
        <div className="section-header">
          <div className="section-title">진행 중인 실험</div>
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

        {experiments.map((exp) => (
          <div key={exp.id} className="experiment-card">
            <div className="experiment-header">
              <div className="experiment-title-section">
                <div className="experiment-title">{exp.title}</div>
                <div className="experiment-meta">
                  <Badge variant="info">{exp.goal}</Badge>
                  <span>{exp.owner}</span>
                  <span>{exp.period}</span>
                </div>
              </div>
              <Badge variant={exp.status}>{exp.statusText}</Badge>
            </div>
            
            {exp.progress !== undefined && (
              <div className="progress-section">
                <div className="progress-label">
                  <span>진행률</span>
                  <span>{exp.progress}% (D-{exp.daysLeft})</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${exp.progress}%` }}></div>
                </div>
              </div>
            )}
            
            <div className="experiment-metrics">
              {exp.metrics.map((metric, idx) => (
                <div key={idx} className="metric-item">
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-value">{metric.value}</div>
                  {metric.change && (
                    <div className={`metric-change ${metric.changeType}`}>{metric.change}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Experiments
