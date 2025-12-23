import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import './Insights.css'

function Insights() {
  const navigate = useNavigate()
  const [expandedGroups, setExpandedGroups] = useState({})
  const [activeFilter, setActiveFilter] = useState('all')
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date-desc') // 'date-desc', 'date-asc', 'roi-desc', 'roi-asc', 'performance-desc'
  const [favorites, setFavorites] = useState(new Set(['conversion-1'])) // favoriteId format: groupId-initiativeIdx
  const [filters, setFilters] = useState({
    types: [],
    teams: [],
    status: 'all',
    dateRange: 'all'
  })

  const toggleExpand = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const toggleFavorite = (groupId, initiativeIdx) => {
    const favoriteId = `${groupId}-${initiativeIdx}`
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(favoriteId)) {
        newSet.delete(favoriteId)
      } else {
        newSet.add(favoriteId)
      }
      return newSet
    })
  }

  const isFavorite = (groupId, initiativeIdx) => {
    return favorites.has(`${groupId}-${initiativeIdx}`)
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

  // Combine all initiatives from all groups
  const allInitiatives = useMemo(() => {
    const allGroups = [...objectiveGroups, ...additionalCategories]
    const initiatives = []

    allGroups.forEach(group => {
      const groupInitiatives = [...group.initiatives, ...(group.hiddenInitiatives || [])]
      groupInitiatives.forEach((initiative, idx) => {
        initiatives.push({
          ...initiative,
          groupId: group.id,
          groupTitle: group.title,
          metricLabel: group.metricLabel,
          initiativeIdx: idx,
          favoriteId: `${group.id}-${idx}`
        })
      })
    })

    return initiatives
  }, [objectiveGroups, additionalCategories])

  // Filter and sort initiatives
  const filteredAndSortedInitiatives = useMemo(() => {
    let result = [...allInitiatives]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(initiative =>
        initiative.name.toLowerCase().includes(query) ||
        initiative.desc.toLowerCase().includes(query) ||
        initiative.groupTitle.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.types.length > 0) {
      result = result.filter(initiative => filters.types.includes(initiative.type))
    }
    if (filters.teams.length > 0) {
      result = result.filter(initiative => filters.teams.includes(initiative.team))
    }
    if (filters.status !== 'all') {
      result = result.filter(initiative => initiative.status === filters.status)
    }

    // Apply favorites filter
    if (activeFilter === 'favorites') {
      result = result.filter(initiative => favorites.has(initiative.favoriteId))
    }

    // Apply sorting
    result.sort((a, b) => {
      const roiA = parseFloat(a.roi)
      const roiB = parseFloat(b.roi)
      const changeA = parseFloat(a.change.replace('%', '').replace('+', ''))
      const changeB = parseFloat(b.change.replace('%', '').replace('+', ''))

      switch (sortBy) {
        case 'roi-desc':
          return roiB - roiA
        case 'roi-asc':
          return roiA - roiB
        case 'performance-desc':
          return changeB - changeA
        case 'performance-asc':
          return changeA - changeB
        case 'date-asc':
          return a.period.localeCompare(b.period)
        case 'date-desc':
        default:
          return b.period.localeCompare(a.period)
      }
    })

    return result
  }, [allInitiatives, searchQuery, filters, activeFilter, favorites, sortBy])

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
          <button className="btn-compact btn-primary" onClick={() => navigate('/insights/new')}>
            <span>+ 새 인사이트</span>
          </button>
        }
      />

      {/* Search and View Controls */}
      <div className="insights-controls">
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="실험 이름, 설명, 목표로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="view-controls">
          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            필터
          </button>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">최신순</option>
            <option value="date-asc">오래된순</option>
            <option value="roi-desc">ROI 높은순</option>
            <option value="roi-asc">ROI 낮은순</option>
            <option value="performance-desc">성과 높은순</option>
            <option value="performance-asc">성과 낮은순</option>
          </select>

          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="테이블 뷰"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
              title="카드 뷰"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>타입</label>
            <div className="filter-options">
              {['A/B Test', 'Campaign', 'Feature', 'Analysis'].map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, types: [...prev.types, type] }))
                      } else {
                        setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== type) }))
                      }
                    }}
                  />
                  <Badge variant={getTypeVariant(type)}>{type}</Badge>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>팀</label>
            <div className="filter-options">
              {['Product', 'Marketing', 'Data', 'CX'].map(team => (
                <label key={team} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.teams.includes(team)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, teams: [...prev.teams, team] }))
                      } else {
                        setFilters(prev => ({ ...prev, teams: prev.teams.filter(t => t !== team) }))
                      }
                    }}
                  />
                  <span className="team-badge-small">{team}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>기타</label>
            <div className="filter-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={activeFilter === 'favorites'}
                  onChange={(e) => {
                    setActiveFilter(e.target.checked ? 'favorites' : 'all')
                  }}
                />
                <span className="favorites-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={activeFilter === 'favorites' ? '#fbbf24' : 'none'} stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  즐겨찾기만 보기 ({favorites.size})
                </span>
              </label>
            </div>
          </div>

          <button
            className="clear-filters-btn"
            onClick={() => {
              setFilters({ types: [], teams: [], status: 'all', dateRange: 'all' })
              setActiveFilter('all')
            }}
          >
            필터 초기화
          </button>
        </div>
      )}


      {/* Insights Content */}
      <div className="insights-section">
        {viewMode === 'card' ? (
          // Card View
          <div className="insights-cards">
            {filteredAndSortedInitiatives.map((initiative, index) => (
              <div
                key={`${initiative.groupId}-${initiative.initiativeIdx}`}
                className={`insight-card ${initiative.highlight === 'best' ? 'best-performer' : ''}`}
                style={{ animationDelay: `${0.05 * index}s` }}
                onClick={() => handleInitiativeClick(initiative.groupId, initiative.initiativeIdx)}
              >
                <div className="card-header">
                  <div className="card-title-row">
                    <h3 className="card-title">{initiative.name}</h3>
                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(initiative.groupId, initiative.initiativeIdx)
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite(initiative.groupId, initiative.initiativeIdx) ? '#fbbf24' : 'none'} stroke={isFavorite(initiative.groupId, initiative.initiativeIdx) ? '#fbbf24' : 'currentColor'} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  </div>
                  <p className="card-desc">{initiative.desc}</p>
                  <div className="card-tags">
                    <span className="card-category">{initiative.groupTitle}</span>
                    <Badge variant={getTypeVariant(initiative.type)}>{initiative.type}</Badge>
                  </div>
                </div>

                <div className="card-metrics">
                  <div className="card-metric">
                    <div className="metric-label">{initiative.metricLabel}</div>
                    <div className="metric-value-large">{initiative.metric}</div>
                    <div className={`metric-change ${initiative.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {initiative.change}
                    </div>
                  </div>
                  <div className="card-metric">
                    <div className="metric-label">ROI</div>
                    <div className="metric-value-large">{initiative.roi}</div>
                    <div className={`metric-change ${initiative.roiLabel === '최고 성과' || initiative.roiLabel === '목표 달성' ? 'positive' : 'neutral'}`}>
                      {initiative.roiLabel}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="team-badge-small">{initiative.team}</span>
                  <span className="date-text">{initiative.period}</span>
                  <Badge variant={initiative.status}>완료</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th style={{ width: '320px' }}>시도 내용</th>
                  <th style={{ width: '120px' }}>목표</th>
                  <th style={{ width: '100px' }}>타입</th>
                  <th className="align-right" style={{ width: '120px' }}>성과</th>
                  <th className="align-right" style={{ width: '120px' }}>ROI</th>
                  <th style={{ width: '100px' }}>담당</th>
                  <th style={{ width: '140px' }}>기간</th>
                  <th style={{ width: '80px' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedInitiatives.map((initiative, index) => (
                  <tr
                    key={`${initiative.groupId}-${initiative.initiativeIdx}`}
                    className={`table-row ${initiative.highlight === 'best' ? 'best-performer' : ''} ${initiative.groupId === 'conversion' && initiative.initiativeIdx === 1 ? 'clickable-initiative' : 'non-clickable-initiative'}`}
                    onClick={() => handleInitiativeClick(initiative.groupId, initiative.initiativeIdx)}
                  >
                    <td>
                      <button
                        className="favorite-btn-small"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(initiative.groupId, initiative.initiativeIdx)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite(initiative.groupId, initiative.initiativeIdx) ? '#fbbf24' : 'none'} stroke={isFavorite(initiative.groupId, initiative.initiativeIdx) ? '#fbbf24' : 'currentColor'} strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    </td>
                    <td>
                      <div className="initiative-cell">
                        <div className="initiative-name">
                          {initiative.name}
                          {initiative.groupId === 'conversion' && initiative.initiativeIdx === 1 && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          )}
                        </div>
                        <div className="initiative-desc">{initiative.desc}</div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{initiative.groupTitle}</span>
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
        )}

        {filteredAndSortedInitiatives.length === 0 && (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <p>검색 결과가 없습니다</p>
            <button className="btn-compact btn-secondary" onClick={() => {
              setSearchQuery('')
              setFilters({ types: [], teams: [], status: 'all', dateRange: 'all' })
              setActiveFilter('all')
            }}>
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="results-count-footer">
        {filteredAndSortedInitiatives.length}개의 결과
      </div>
    </div>
  )
}

export default Insights
