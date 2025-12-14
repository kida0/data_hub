import './Home.css'

function Home() {
  return (
    <div className="home-page">
      {/* Header */}
      <div className="header">
        <h1 className="page-title">오늘의 인사이트</h1>
        <p className="page-description">지금 확인해야 할 중요한 변화</p>
      </div>

      {/* Critical Alerts Section */}
      <div className="alert-section">
        <div className="alert-card urgent">
          <div className="alert-header">
            <div className="alert-badge urgent-badge">긴급</div>
            <div className="alert-time">2시간 전</div>
          </div>
          <div className="alert-title">이탈 위험군 18,392명 → 전주 대비 23% 급증</div>
          <div className="alert-description">
            지난 7일간 구매 없는 고객이 빠르게 늘고 있습니다. 평균 LTV ¥3.2M, 회복 가능성 38.5%로 조기 개입이 필요합니다.
          </div>
          <div className="alert-action">
            <a href="#" className="action-link">윈백 캠페인 실행 →</a>
          </div>
        </div>

        <div className="alert-card opportunity">
          <div className="alert-header">
            <div className="alert-badge opportunity-badge">기회</div>
            <div className="alert-time">5시간 전</div>
          </div>
          <div className="alert-title">신규 고가치 고객 127명 발견</div>
          <div className="alert-description">
            평균 LTV ¥8.2M, 첫 구매 후 7일 내 재구매율 84%. 조기 VIP 관계 형성으로 장기 고객화 가능성이 높습니다.
          </div>
          <div className="alert-action">
            <a href="#" className="action-link">VIP 온보딩 CRM 발송 →</a>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="metrics-section">
        <div className="section-header">
          <h2 className="section-title">핵심 지표</h2>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">총 고객 수</div>
            <div className="metric-value">1.2M</div>
            <div className="metric-change positive">
              <span className="change-arrow">↑</span>
              <span className="change-value">8.2%</span>
              <span className="change-period">vs 지난달</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">활성 고객 비율</div>
            <div className="metric-value">70.6%</div>
            <div className="metric-change positive">
              <span className="change-arrow">↑</span>
              <span className="change-value">4.3%p</span>
              <span className="change-period">vs 지난달</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">평균 고객생애가치</div>
            <div className="metric-value">¥3.2M</div>
            <div className="metric-change positive">
              <span className="change-arrow">↑</span>
              <span className="change-value">15.7%</span>
              <span className="change-period">vs 지난달</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">주간 매출</div>
            <div className="metric-value">¥340M</div>
            <div className="metric-change positive">
              <span className="change-arrow">↑</span>
              <span className="change-value">12% 달성</span>
              <span className="change-period">목표 대비</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segments Overview */}
      <div className="segments-section">
        <div className="section-header">
          <h2 className="section-title">주요 세그먼트</h2>
          <a href="#" className="section-link">전체 보기 →</a>
        </div>

        <div className="segment-list">
          <div className="segment-row">
            <div className="segment-info">
              <div className="segment-name">VIP 고객</div>
              <div className="segment-count">12,847명</div>
            </div>
            <div className="segment-metrics">
              <div className="segment-metric">
                <span className="metric-key">평균 구매액</span>
                <span className="metric-val">¥8.2M</span>
              </div>
              <div className="segment-metric">
                <span className="metric-key">재구매율</span>
                <span className="metric-val">87.5%</span>
              </div>
            </div>
          </div>

          <div className="segment-row">
            <div className="segment-info">
              <div className="segment-name">신규 가입자</div>
              <div className="segment-count">24,521명</div>
            </div>
            <div className="segment-metrics">
              <div className="segment-metric">
                <span className="metric-key">첫 구매 전환</span>
                <span className="metric-val">12.8%</span>
              </div>
              <div className="segment-metric">
                <span className="metric-key">앱 실행률</span>
                <span className="metric-val">68.4%</span>
              </div>
            </div>
          </div>

          <div className="segment-row">
            <div className="segment-info">
              <div className="segment-name">충성 고객</div>
              <div className="segment-count">45,210명</div>
            </div>
            <div className="segment-metrics">
              <div className="segment-metric">
                <span className="metric-key">NPS</span>
                <span className="metric-val">82점</span>
              </div>
              <div className="segment-metric">
                <span className="metric-key">월 구매</span>
                <span className="metric-val">2.3회</span>
              </div>
            </div>
          </div>

          <div className="segment-row highlight">
            <div className="segment-info">
              <div className="segment-name">이탈 위험군</div>
              <div className="segment-count">18,392명</div>
            </div>
            <div className="segment-metrics">
              <div className="segment-metric">
                <span className="metric-key">미방문</span>
                <span className="metric-val">90일+</span>
              </div>
              <div className="segment-metric">
                <span className="metric-key">회복 가능성</span>
                <span className="metric-val">38.5%</span>
              </div>
            </div>
          </div>

          <div className="segment-row">
            <div className="segment-info">
              <div className="segment-name">가격 민감군</div>
              <div className="segment-count">67,834명</div>
            </div>
            <div className="segment-metrics">
              <div className="segment-metric">
                <span className="metric-key">쿠폰 사용률</span>
                <span className="metric-val">94.2%</span>
              </div>
              <div className="segment-metric">
                <span className="metric-key">할인 구매율</span>
                <span className="metric-val">88.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <div className="section-header">
          <h2 className="section-title">최근 활동</h2>
        </div>

        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <div className="activity-title">블랙프라이데이 캠페인 목표 달성</div>
              <div className="activity-meta">ROI 342% · 매출 ¥42M · 2시간 전</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon info">↑</div>
            <div className="activity-content">
              <div className="activity-title">신규 가입자 앱 설치율 신기록</div>
              <div className="activity-meta">3,842건 · 전일 대비 +24% · 5시간 전</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon info">⚡</div>
            <div className="activity-content">
              <div className="activity-title">고객 재구매 주기 단축</div>
              <div className="activity-meta">45일 → 38일 (15.6% 개선) · 어제</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <div className="activity-title">주간 매출 목표 112% 달성</div>
              <div className="activity-meta">¥340M / ¥303M · 어제</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
