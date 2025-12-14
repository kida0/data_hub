import './Segments.css'

function Segments() {
  const segments = [
    {
      id: 1,
      name: 'VIP 고객',
      description: '최근 6개월 구매액 500만원 이상, 월 3회 이상 방문',
      customerCount: 12847,
      metric1: { value: '8.2M', label: '평균 구매액' },
      metric2: { value: '42.3%', label: '전환율' },
      metric3: { value: '87.5%', label: '재구매율' },
      category: 'VIP 관리',
      lastTouch: { channel: '이메일', date: '2일 전 (2024.12.10)', icon: 'email' }
    },
    {
      id: 2,
      name: '신규 가입자',
      description: '최근 30일 내 가입, 첫 구매 미완료',
      customerCount: 24521,
      metric1: { value: '68.4%', label: '앱 실행률' },
      metric2: { value: '34.2%', label: '장바구니' },
      metric3: { value: '12.8%', label: '첫구매 전환' },
      category: '신규 획득',
      lastTouch: { channel: '푸시', date: '5일 전 (2024.12.07)', icon: 'push' }
    },
    {
      id: 3,
      name: '이탈 위험군',
      description: '90일 이상 미방문, 과거 활성 고객',
      customerCount: 18392,
      metric1: { value: '3.2M', label: '평균 LTV' },
      metric2: { value: '127일', label: '미방문 일수' },
      metric3: { value: '38.5%', label: '회복 가능성' },
      category: '재활성화',
      lastTouch: null
    },
    {
      id: 4,
      name: '충성 고객',
      description: '12개월 이상 연속 구매, 월 평균 2회 이상',
      customerCount: 45210,
      metric1: { value: '2.4M', label: '평균 구매액' },
      metric2: { value: '82점', label: 'NPS 점수' },
      metric3: { value: '45.2%', label: '추천율' },
      category: '리텐션',
      lastTouch: { channel: 'SMS', date: '1주일 전 (2024.12.05)', icon: 'sms' }
    },
    {
      id: 5,
      name: '가격 민감군',
      description: '할인/프로모션 시에만 구매, 쿠폰 사용률 높음',
      customerCount: 67834,
      metric1: { value: '94.2%', label: '쿠폰 사용률' },
      metric2: { value: '88.7%', label: '할인 구매율' },
      metric3: { value: '15.3%', label: '평균 할인액' },
      category: '리텐션',
      lastTouch: { channel: '이메일', date: '3일 전 (2024.12.09)', icon: 'email' }
    },
    {
      id: 6,
      name: '잠재 고객',
      description: '앱 설치 후 브라우징만, 구매 미전환',
      customerCount: 156920,
      metric1: { value: '3.2분', label: '체류시간' },
      metric2: { value: '8.4회', label: '페이지뷰' },
      metric3: { value: '2.1개', label: '관심 카테고리' },
      category: '신규 획득',
      lastTouch: { channel: '푸시', date: '10일 전 (2024.12.02)', icon: 'push' }
    },
  ]

  return (
    <div className="segments-page">
      <div className="header">
        <div className="header-top">
          <h1 className="page-title">Segment</h1>
        </div>
        <p className="page-description">
          고객 세그먼트별 주요 지표를 모니터링하고 CRM 캠페인을 계획하세요.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="overview-section">
        <div className="section-title">전체 현황</div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">전체 세그먼트</div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">+3 from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">총 고객 수</div>
            <div className="stat-value">1.2M</div>
            <div className="stat-change positive">+8.2% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">활성 고객</div>
            <div className="stat-value">847K</div>
            <div className="stat-change positive">+12.5% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">이탈 위험군</div>
            <div className="stat-value">142K</div>
            <div className="stat-change negative">+5.3% from last month</div>
          </div>
        </div>
      </div>

      {/* Segments Table */}
      <div className="segments-section">
        <div className="segments-controls">
          <div className="controls-left">
            <div className="section-title" style={{ marginBottom: 0 }}>세그먼트 목록</div>
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b95a1" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input type="text" placeholder="검색..." />
            </div>
            <select className="filter-dropdown">
              <option>전체 분류</option>
              <option>리텐션</option>
              <option>신규 획득</option>
              <option>재활성화</option>
              <option>VIP 관리</option>
            </select>
          </div>
          <div className="search-filter">
            <button className="btn-compact btn-secondary">
              <span>내보내기</span>
            </button>
            <button className="btn-compact btn-primary">
              <span>+ 새 세그먼트</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '240px' }}>세그먼트명</th>
                <th className="align-right sortable" style={{ width: '110px' }}>
                  고객 수
                  <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
                  </svg>
                </th>
                <th className="align-right sortable" style={{ width: '110px' }}>
                  주요지표 1
                  <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
                  </svg>
                </th>
                <th className="align-right sortable" style={{ width: '110px' }}>
                  주요지표 2
                  <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
                  </svg>
                </th>
                <th className="align-right sortable" style={{ width: '110px' }}>
                  주요지표 3
                  <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
                  </svg>
                </th>
                <th style={{ width: '100px' }}>분류</th>
                <th style={{ width: '180px' }}>마지막 터치</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment.id}>
                  <td>
                    <div className="segment-name-cell">
                      <div className="segment-name-text">{segment.name}</div>
                      <div className="segment-desc-text">{segment.description}</div>
                    </div>
                  </td>
                  <td className="align-right">
                    <span className="metric-cell">{segment.customerCount.toLocaleString()}<span className="metric-unit-small">명</span></span>
                  </td>
                  <td className="align-right">
                    <span className="metric-cell">{segment.metric1.value}<span className="metric-unit-small"></span></span>
                    <div className="segment-desc-text" style={{ marginTop: '2px' }}>{segment.metric1.label}</div>
                  </td>
                  <td className="align-right">
                    <span className="metric-cell">{segment.metric2.value}<span className="metric-unit-small"></span></span>
                    <div className="segment-desc-text" style={{ marginTop: '2px' }}>{segment.metric2.label}</div>
                  </td>
                  <td className="align-right">
                    <span className="metric-cell">{segment.metric3.value}<span className="metric-unit-small"></span></span>
                    <div className="segment-desc-text" style={{ marginTop: '2px' }}>{segment.metric3.label}</div>
                  </td>
                  <td>
                    <span className="category-badge">{segment.category}</span>
                  </td>
                  <td>
                    {segment.lastTouch ? (
                      <div className="last-touch-cell">
                        <div className="touch-channel">
                          <svg className="touch-icon-small" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                            {segment.lastTouch.icon === 'email' && (
                              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            )}
                            {segment.lastTouch.icon === 'push' && (
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            )}
                            {segment.lastTouch.icon === 'sms' && (
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            )}
                          </svg>
                          {segment.lastTouch.channel}
                        </div>
                        <div className="touch-date">{segment.lastTouch.date}</div>
                      </div>
                    ) : (
                      <div className="last-touch-cell">
                        <div className="no-touch">발송 이력 없음</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">1-6 of 24 segments</div>
            <div className="pagination-controls">
              <button className="pagination-btn" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">4</button>
              <button className="pagination-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Segments
