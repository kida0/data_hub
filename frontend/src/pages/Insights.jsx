import { useState } from 'react'
import './Insights.css'

function Insights() {
  const [expandedGroups, setExpandedGroups] = useState({})

  const toggleExpand = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const objectiveGroups = [
    {
      id: 'conversion',
      title: '첫 구매 전환',
      count: 12,
      bestPerformance: '+42.3%',
      avgImprovement: '+18.7%',
      totalInvestment: '¥24M',
      metricLabel: '전환율',
      initiatives: [
        {
          name: '신규 온보딩 플로우 개선',
          desc: '튜토리얼 단계 축소 + 인터랙티브 강화',
          type: 'A/B Test',
          metric: '15.2%',
          change: '+42.3%',
          roi: '428%',
          roiLabel: '최고 성과',
          investment: '¥3.2M',
          team: 'Product',
          period: '11/15 - 12/10',
          status: 'completed',
          highlight: 'best'
        },
        {
          name: '신규 가입 쿠폰 (20% 할인)',
          desc: '가입 후 24시간 내 사용 가능한 할인 쿠폰',
          type: 'Campaign',
          metric: '13.8%',
          change: '+29.4%',
          roi: '246%',
          roiLabel: '목표 달성',
          investment: '¥8.5M',
          team: 'Marketing',
          period: '10/01 - 11/30',
          status: 'completed'
        },
        {
          name: '첫 구매 상품 추천 알고리즘',
          desc: '신규 가입자 행동 기반 맞춤 추천',
          type: 'Feature',
          metric: '12.4%',
          change: '+16.2%',
          roi: '312%',
          roiLabel: '목표 달성',
          investment: '¥5.8M',
          team: 'Data',
          period: '09/10 - 11/20',
          status: 'completed'
        }
      ],
      hiddenCount: 9
    },
    {
      id: 'repurchase',
      title: '재구매 촉진',
      count: 8,
      bestPerformance: '+34.2%',
      avgImprovement: '+21.8%',
      totalInvestment: '¥18M',
      metricLabel: '재구매율',
      initiatives: [
        {
          name: 'VIP 고객 목금 특가 프로모션',
          desc: '재구매 패턴 분석 기반 타이밍 최적화',
          type: 'Campaign',
          metric: '62.4%',
          change: '+34.2%',
          roi: '521%',
          roiLabel: '최고 성과',
          investment: '¥4.8M',
          team: 'Marketing',
          period: '11/01 - 11/30',
          status: 'completed',
          highlight: 'best'
        },
        {
          name: '구매 주기 기반 리마인더',
          desc: '개인별 재구매 주기 예측 후 알림 발송',
          type: 'Feature',
          metric: '54.7%',
          change: '+17.6%',
          roi: '342%',
          roiLabel: '목표 달성',
          investment: '¥6.2M',
          team: 'Product',
          period: '09/01 - 11/15',
          status: 'completed'
        },
        {
          name: '로열티 포인트 2배 적립',
          desc: '2회차 구매 시 포인트 2배 적립 이벤트',
          type: 'Campaign',
          metric: '51.2%',
          change: '+10.1%',
          roi: '198%',
          roiLabel: '목표 달성',
          investment: '¥7.0M',
          team: 'Marketing',
          period: '10/01 - 11/30',
          status: 'completed'
        }
      ],
      hiddenCount: 5
    },
    {
      id: 'churn',
      title: '이탈 방지',
      count: 6,
      bestPerformance: '+28.3%',
      avgImprovement: '+15.4%',
      totalInvestment: '¥12M',
      metricLabel: '회복율',
      initiatives: [
        {
          name: '이탈 예측 모델 기반 윈백',
          desc: '14일 전 조기 감지 후 맞춤 혜택 제공',
          type: 'Feature',
          metric: '38.5%',
          change: '+28.3%',
          roi: '456%',
          roiLabel: '최고 성과',
          investment: '¥5.4M',
          team: 'Data',
          period: '08/01 - 11/30',
          status: 'completed',
          highlight: 'best'
        },
        {
          name: '장기 미방문 고객 쿠폰',
          desc: '90일 이상 미방문 고객 30% 할인 쿠폰',
          type: 'Campaign',
          metric: '24.7%',
          change: '+8.2%',
          roi: '167%',
          roiLabel: '목표 달성',
          investment: '¥6.6M',
          team: 'Marketing',
          period: '10/01 - 11/30',
          status: 'completed'
        },
        {
          name: '이탈 고객 설문 + 맞춤 혜택',
          desc: '이탈 사유 파악 후 개인화된 제안',
          type: 'Campaign',
          metric: '18.3%',
          change: '+5.1%',
          roi: '142%',
          roiLabel: '목표 달성',
          investment: '¥2.8M',
          team: 'CX',
          period: '11/01 - 12/01',
          status: 'completed'
        }
      ],
      hiddenCount: 3
    }
  ]

  const getTypeBadgeClass = (type) => {
    const typeMap = {
      'A/B Test': 'type-ab-test',
      'Campaign': 'type-campaign',
      'Feature': 'type-feature',
      'Analysis': 'type-analysis'
    }
    return `type-badge ${typeMap[type] || ''}`
  }

  return (
    <div className="insights-page">
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <h1 className="page-title">Insights</h1>
          <div className="header-actions">
            <button className="btn-compact btn-secondary">
              <span>목표 관리</span>
            </button>
            <button className="btn-compact btn-primary">
              <span>+ 새 인사이트</span>
            </button>
          </div>
        </div>
        <p className="page-description">
          목표별 시도와 성과를 비교하고 최적의 전략을 발견하세요
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-section">
        <div className="filter-tabs">
          <div className="filter-tab active">
            전체 목표 <span className="filter-count">12</span>
          </div>
          <div className="filter-tab">
            즐겨찾기 <span className="filter-count">4</span>
          </div>
        </div>
      </div>

      {/* Insights Table */}
      <div className="insights-section">
        {objectiveGroups.map((group, index) => (
          <div key={group.id} className="objective-group" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
            <div className="objective-header">
              <div className="objective-title-row">
                <h2 className="objective-title">{group.title}</h2>
                <span className="objective-count">{group.count}개 시도</span>
              </div>
              <div className="objective-stats">
                <div className="objective-stat">
                  <span className="stat-label">최고 성과</span>
                  <span className="stat-value">{group.bestPerformance}</span>
                </div>
                <div className="objective-stat">
                  <span className="stat-label">평균 개선</span>
                  <span className="stat-value">{group.avgImprovement}</span>
                </div>
                <div className="objective-stat">
                  <span className="stat-label">총 투자</span>
                  <span className="stat-value">{group.totalInvestment}</span>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="insights-table">
                <thead>
                  <tr>
                    <th style={{ width: '280px' }}>시도 내용</th>
                    <th style={{ width: '100px' }}>타입</th>
                    <th className="align-right sortable" style={{ width: '110px' }}>{group.metricLabel}</th>
                    <th className="align-right sortable" style={{ width: '110px' }}>ROI</th>
                    <th className="align-right sortable" style={{ width: '110px' }}>투자 비용</th>
                    <th style={{ width: '100px' }}>담당</th>
                    <th style={{ width: '100px' }}>기간</th>
                    <th style={{ width: '80px' }}>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {group.initiatives.map((initiative, idx) => (
                    <tr 
                      key={idx} 
                      className={`table-row ${initiative.highlight === 'best' ? 'best-performer' : ''}`}
                    >
                      <td>
                        <div className="initiative-cell">
                          <div className="initiative-name">{initiative.name}</div>
                          <div className="initiative-desc">{initiative.desc}</div>
                        </div>
                      </td>
                      <td>
                        <span className={getTypeBadgeClass(initiative.type)}>{initiative.type}</span>
                      </td>
                      <td className="align-right">
                        <span className="metric-value">{initiative.metric}</span>
                        <div className={`metric-change ${initiative.change.startsWith('+') ? 'positive' : 'negative'}`}>
                          {initiative.change}
                        </div>
                      </td>
                      <td className="align-right">
                        <span className="metric-value">{initiative.roi}</span>
                        <div className={`metric-change ${initiative.roiLabel === '최고 성과' || initiative.roiLabel === '목표 달성' ? 'positive' : 'neutral'}`}>
                          {initiative.roiLabel}
                        </div>
                      </td>
                      <td className="align-right">
                        <span className="metric-value">{initiative.investment}</span>
                      </td>
                      <td>
                        <span className="team-badge-small">{initiative.team}</span>
                      </td>
                      <td>
                        <span className="date-text">{initiative.period}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-${initiative.status}`}>완료</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="expand-section">
                <button className="expand-btn" onClick={() => toggleExpand(group.id)}>
                  <span className="expand-text">
                    {expandedGroups[group.id] ? '접기' : `+ ${group.hiddenCount}개 더 보기`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* More categories indicator */}
        <div className="more-categories">
          <button className="load-more-btn">
            <span>+ 9개 목표 카테고리 더 보기</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Insights
