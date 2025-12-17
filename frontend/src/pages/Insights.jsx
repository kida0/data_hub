import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import './Insights.css'

function Insights() {
  const navigate = useNavigate()
  const [expandedGroups, setExpandedGroups] = useState({})
  const [activeFilter, setActiveFilter] = useState('all')
  const [showMoreCategories, setShowMoreCategories] = useState(false)

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
      count: 5,
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
      hiddenInitiatives: [
        {
          name: '결제 페이지 UI/UX 개선',
          desc: '결제 과정 단순화 및 신뢰 요소 강화',
          type: 'A/B Test',
          metric: '11.8%',
          change: '+11.3%',
          roi: '289%',
          roiLabel: '목표 달성',
          team: 'Product',
          period: '08/20 - 10/30',
          status: 'completed'
        },
        {
          name: '소셜 로그인 추가',
          desc: '카카오/네이버 간편 가입으로 전환율 향상',
          type: 'Feature',
          metric: '10.5%',
          change: '+8.7%',
          roi: '245%',
          roiLabel: '목표 달성',
          team: 'Product',
          period: '07/15 - 09/20',
          status: 'completed'
        }
      ],
      hiddenCount: 2
    },
    {
      id: 'repurchase',
      title: '재구매 촉진',
      count: 4,
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
      hiddenInitiatives: [
        {
          name: '제품 리뷰 리워드 프로그램',
          desc: '리뷰 작성 시 포인트 제공으로 재참여 유도',
          type: 'Campaign',
          metric: '49.8%',
          change: '+7.2%',
          roi: '215%',
          roiLabel: '목표 달성',
          team: 'Marketing',
          period: '09/15 - 11/15',
          status: 'completed'
        }
      ],
      hiddenCount: 1
    },
    {
      id: 'churn',
      title: '이탈 방지',
      count: 4,
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
      hiddenInitiatives: [
        {
          name: '이탈 고객 맞춤 재방문 캠페인',
          desc: '과거 구매 이력 기반 맞춤 제안',
          type: 'Campaign',
          metric: '16.8%',
          change: '+3.9%',
          roi: '178%',
          roiLabel: '목표 달성',
          team: 'Marketing',
          period: '09/01 - 10/30',
          status: 'completed'
        }
      ],
      hiddenCount: 1
    }
  ]

  const additionalCategories = [
    {
      id: 'upsell',
      title: '업셀링',
      count: 2,
      metricLabel: '업셀 전환율',
      initiatives: [
        {
          name: '장바구니 추천 상품',
          desc: '구매 예정 상품과 함께 구매하면 좋은 상품 추천',
          type: 'Feature',
          metric: '28.4%',
          change: '+22.8%',
          roi: '385%',
          roiLabel: '최고 성과',
          team: 'Product',
          period: '10/01 - 12/01',
          status: 'completed',
          highlight: 'best'
        },
        {
          name: '프리미엄 버전 업그레이드 제안',
          desc: '일반 상품 구매자에게 프리미엄 옵션 노출',
          type: 'A/B Test',
          metric: '24.2%',
          change: '+18.5%',
          roi: '298%',
          roiLabel: '목표 달성',
          team: 'Product',
          period: '09/15 - 11/20',
          status: 'completed'
        }
      ],
      hiddenInitiatives: [],
      hiddenCount: 0
    },
    {
      id: 'referral',
      title: '추천 유입',
      count: 2,
      metricLabel: '추천 전환율',
      initiatives: [
        {
          name: '친구 초대 리워드',
          desc: '추천인과 신규 가입자 모두에게 쿠폰 제공',
          type: 'Campaign',
          metric: '18.7%',
          change: '+35.2%',
          roi: '412%',
          roiLabel: '최고 성과',
          team: 'Marketing',
          period: '10/10 - 12/10',
          status: 'completed',
          highlight: 'best'
        },
        {
          name: '소셜 공유 인센티브',
          desc: '구매 후 SNS 공유 시 포인트 적립',
          type: 'Campaign',
          metric: '14.3%',
          change: '+12.8%',
          roi: '265%',
          roiLabel: '목표 달성',
          team: 'Marketing',
          period: '09/20 - 11/30',
          status: 'completed'
        }
      ],
      hiddenInitiatives: [],
      hiddenCount: 0
    }
  ]

  const getTypeVariant = (type) => {
    const typeMap = {
      'A/B Test': 'ab-test',
      'Campaign': 'campaign',
      'Feature': 'feature',
      'Analysis': 'analysis'
    }
    return typeMap[type] || 'info'
  }

  const handleInitiativeClick = (groupId, initiativeIdx) => {
    // "신규 가입 쿠폰 (20% 할인)" 항목만 클릭 가능
    if (groupId === 'conversion' && initiativeIdx === 1) {
      navigate(`/insights/${groupId}/${initiativeIdx}`)
    }
  }

  return (
    <div className="insights-page">
      {/* Header */}
      <PageHeader
        title="Insights"
        description="목표별 시도와 성과를 비교하고 최적의 전략을 발견하세요"
        actions={
          <>
            <button className="btn-compact btn-secondary" onClick={() => alert('목표 관리 기능은 준비 중입니다.')}>
              <span>목표 관리</span>
            </button>
            <button className="btn-compact btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              <span>+ 새 인사이트</span>
            </button>
          </>
        }
      />

      {/* Filter Tabs */}
      <div className="filter-section">
        <div className="filter-tabs">
          <div 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            전체 목표 <span className="filter-count">{objectiveGroups.length + additionalCategories.length}</span>
          </div>
          <div 
            className={`filter-tab ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveFilter('favorites')}
          >
            즐겨찾기 <span className="filter-count">2</span>
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
            </div>

            <div className="table-container">
              <table className="insights-table">
                <thead>
                  <tr>
                    <th style={{ width: '320px' }}>시도 내용</th>
                    <th style={{ width: '100px' }}>타입</th>
                    <th className="align-right sortable" style={{ width: '120px' }}>{group.metricLabel}</th>
                    <th className="align-right sortable" style={{ width: '120px' }}>ROI</th>
                    <th style={{ width: '100px' }}>담당</th>
                    <th style={{ width: '140px' }}>기간</th>
                    <th style={{ width: '80px' }}>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {group.initiatives.map((initiative, idx) => (
                    <tr 
                      key={idx} 
                      className={`table-row ${initiative.highlight === 'best' ? 'best-performer' : ''} ${group.id === 'conversion' && idx === 1 ? 'clickable-initiative' : 'non-clickable-initiative'}`}
                      onClick={() => handleInitiativeClick(group.id, idx)}
                    >
                      <td>
                        <div className="initiative-cell">
                          <div className="initiative-name">
                            {initiative.name}
                            {group.id === 'conversion' && idx === 1 && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            )}
                          </div>
                          <div className="initiative-desc">{initiative.desc}</div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={getTypeVariant(initiative.type)}>{initiative.type}</Badge>
                      </td>
                      <td className="align-right">
                        <div className="metric-cell">
                          <span className="metric-value">{initiative.metric}</span>
                          <span className={`metric-change ${initiative.change.startsWith('+') ? 'positive' : 'negative'}`}>
                            {initiative.change}
                          </span>
                        </div>
                      </td>
                      <td className="align-right">
                        <div className="metric-cell">
                          <span className="metric-value">{initiative.roi}</span>
                          <span className={`metric-change ${initiative.roiLabel === '최고 성과' || initiative.roiLabel === '목표 달성' ? 'positive' : 'neutral'}`}>
                            {initiative.roiLabel}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="team-badge-small">{initiative.team}</span>
                      </td>
                      <td>
                        <span className="date-text">{initiative.period}</span>
                      </td>
                      <td>
                        <Badge variant={initiative.status}>완료</Badge>
                      </td>
                    </tr>
                  ))}
                  {expandedGroups[group.id] && group.hiddenInitiatives && group.hiddenInitiatives.map((initiative, idx) => (
                    <tr 
                      key={`hidden-${idx}`} 
                      className={`table-row ${initiative.highlight === 'best' ? 'best-performer' : ''} non-clickable-initiative`}
                    >
                      <td>
                        <div className="initiative-cell">
                          <div className="initiative-name">{initiative.name}</div>
                          <div className="initiative-desc">{initiative.desc}</div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={getTypeVariant(initiative.type)}>{initiative.type}</Badge>
                      </td>
                      <td className="align-right">
                        <div className="metric-cell">
                          <span className="metric-value">{initiative.metric}</span>
                          <span className={`metric-change ${initiative.change.startsWith('+') ? 'positive' : 'negative'}`}>
                            {initiative.change}
                          </span>
                        </div>
                      </td>
                      <td className="align-right">
                        <div className="metric-cell">
                          <span className="metric-value">{initiative.roi}</span>
                          <span className={`metric-change ${initiative.roiLabel === '최고 성과' || initiative.roiLabel === '목표 달성' ? 'positive' : 'neutral'}`}>
                            {initiative.roiLabel}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="team-badge-small">{initiative.team}</span>
                      </td>
                      <td>
                        <span className="date-text">{initiative.period}</span>
                      </td>
                      <td>
                        <Badge variant={initiative.status}>완료</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {group.hiddenCount > 0 && (
                <div className="expand-section">
                  <button className="expand-btn" onClick={() => toggleExpand(group.id)}>
                    <span className="expand-text">
                      {expandedGroups[group.id] ? '접기' : `+ ${group.hiddenCount}개 더 보기`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Additional Categories */}
        {showMoreCategories && additionalCategories.map((group, index) => (
          <div key={group.id} className="objective-group" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
            <div className="objective-header">
              <div className="objective-title-row">
                <h2 className="objective-title">{group.title}</h2>
                <span className="objective-count">{group.count}개 시도</span>
              </div>
            </div>

            <div className="table-container">
              <table className="insights-table">
                <thead>
                  <tr>
                    <th style={{ width: '320px' }}>시도 내용</th>
                    <th style={{ width: '100px' }}>타입</th>
                    <th className="align-right sortable" style={{ width: '120px' }}>{group.metricLabel}</th>
                    <th className="align-right sortable" style={{ width: '120px' }}>ROI</th>
                    <th style={{ width: '100px' }}>담당</th>
                    <th style={{ width: '140px' }}>기간</th>
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
                        <Badge variant={getTypeVariant(initiative.type)}>{initiative.type}</Badge>
                      </td>
                      <td className="align-right">
                        <div className="metric-cell">
                          <span className="metric-value">{initiative.metric}</span>
                          <span className={`metric-change ${initiative.change.startsWith('+') ? 'positive' : 'negative'}`}>
                            {initiative.change}
                          </span>
                        </div>
                      </td>
                      <td className="align-right">
                        <div className="metric-cell">
                          <span className="metric-value">{initiative.roi}</span>
                          <span className={`metric-change ${initiative.roiLabel === '최고 성과' || initiative.roiLabel === '목표 달성' ? 'positive' : 'neutral'}`}>
                            {initiative.roiLabel}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="team-badge-small">{initiative.team}</span>
                      </td>
                      <td>
                        <span className="date-text">{initiative.period}</span>
                      </td>
                      <td>
                        <Badge variant={initiative.status}>완료</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* More categories indicator */}
        <div className="more-categories">
          <button className="load-more-btn" onClick={() => setShowMoreCategories(!showMoreCategories)}>
            <span>{showMoreCategories ? '카테고리 접기' : `+ ${additionalCategories.length}개 목표 카테고리 더 보기`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Insights
