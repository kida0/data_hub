import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import SectionHeader from '../components/SectionHeader'
import ChartContainer from '../components/ChartContainer'
import TimeRangeSelector from '../components/TimeRangeSelector'
import { createDataset } from '../utils/chartConfig'
import './Dashboard.css'

const Home = () => {
  const [timeRange, setTimeRange] = useState('30')

  // KPI 차트 데이터
  const revenueChartData = {
    labels: ['11/15', '11/18', '11/21', '11/24', '11/27', '11/30', '12/3', '12/6', '12/9', '12/12'],
    datasets: [
      {
        ...createDataset('GMV(백만원)', [32, 35, 38, 36, 40, 42, 38, 45, 48, 52], '#020760', 'line'),
        yAxisID: 'y',
      },
      {
        ...createDataset('전환율(%)', [12.8, 13.2, 13.5, 13.1, 14.2, 14.5, 13.9, 14.8, 15.2, 14.8], '#00b368', 'line'),
        yAxisID: 'y1',
        fill: false,
      },
    ],
  }

  const revenueChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return value + '%'
          },
        },
      },
    },
  }

  const activities = [
    { user: '키다', action: '푸시 알림 문구 최적화', type: '실험을 시작했습니다', time: '방금 전' },
    { user: null, action: '첫 구매 전환율', type: '이 목표를 23% 초과 달성했습니다', time: '5분 전' },
    { user: '키다', action: '신규 가입 쿠폰', type: '실험 결과를 Insights에 저장했습니다', time: '12분 전' },
    { user: null, action: '최근 30일 활성 유저', type: '세그먼트가 업데이트되었습니다', time: '18분 전' },
    { user: '키다', action: '결제 페이지 간소화', type: '실험을 Draft에 추가했습니다', time: '32분 전' },
    { user: null, action: '프리미엄 전환 CTA 버튼', type: '실험이 진행률 50%를 달성했습니다', time: '1시간 전' },
  ]

  return (
    <div className="dashboard-page">
      {/* Header */}
      <PageHeader
        title="Home"
        description="오늘의 데이터 인사이트를 확인하세요."
        actions={
          <div style={{ display: 'none' }}>
            {/* TimeRangeSelector for future use */}
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <button className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              새로고침
            </button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-label">월 GMV</div>
            <div className="metric-icon revenue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="metric-value">12억 원</div>
          <div className="metric-change positive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            동기간 대비 +11.9%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-label">월 방문자</div>
            <div className="metric-icon users">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="metric-value">251,215명</div>
          <div className="metric-change positive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            동기간 대비 +8.8%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-label">월 구매자</div>
            <div className="metric-icon conversion">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value">164,448명</div>
          <div className="metric-change positive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            동기간 대비 +1.2%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-label">구매 전환율</div>
            <div className="metric-icon retention">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value">73.2%</div>
          <div className="metric-change negative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            동기간 대비 +1.2%
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">KPI</div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#020760' }}></div>
                <span>GMV</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#00b368' }}></div>
                <span>구매 전환율</span>
              </div>
            </div>
          </div>
          <div className="canvas-wrapper">
            <ChartContainer type="line" data={revenueChartData} options={revenueChartOptions} height={300} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">실시간 활동</div>
          </div>
          <div className="activity-feed">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <div className="activity-text">
                    {activity.user && <strong>{activity.user}</strong>}
                    {activity.user && '가 '}
                    <strong>{activity.action}</strong>
                    {activity.user ? ' ' : '이 '}
                    {activity.type}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Metrics */}
      <div className="category-grid">
        <div className="category-card">
          <div className="category-header">
            <div className="category-title">구매자 지표</div>
            <div className="view-all">전체보기 →</div>
          </div>
          <div className="metric-list">
            <div className="metric-item">
              <div className="metric-item-name">신규 가입자</div>
              <div>
                <span className="metric-item-value">2,847</span>
                <span className="metric-item-trend up">+8.2%</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">DAU</div>
              <div>
                <span className="metric-item-value">18,234</span>
                <span className="metric-item-trend up">+3.5%</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">평균 세션 시간</div>
              <div>
                <span className="metric-item-value">18.5분</span>
                <span className="metric-item-trend up">+1.2분</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">이탈률</div>
              <div>
                <span className="metric-item-value">32.1%</span>
                <span className="metric-item-trend down">-2.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="category-card">
          <div className="category-header">
            <div className="category-title">판매자 지표</div>
            <div className="view-all">전체보기 →</div>
          </div>
          <div className="metric-list">
            <div className="metric-item">
              <div className="metric-item-name">ARPU</div>
              <div>
                <span className="metric-item-value">28,450원</span>
                <span className="metric-item-trend up">+5.8%</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">객단가</div>
              <div>
                <span className="metric-item-value">158,200원</span>
                <span className="metric-item-trend up">+12.3%</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">프리미엄 전환율</div>
              <div>
                <span className="metric-item-value">3.8%</span>
                <span className="metric-item-trend up">+18.8%</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">환불률</div>
              <div>
                <span className="metric-item-value">2.1%</span>
                <span className="metric-item-trend up">-0.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="category-card">
          <div className="category-header">
            <div className="category-title">서비스 지표</div>
            <div className="view-all">전체보기 →</div>
          </div>
          <div className="metric-list">
            <div className="metric-item">
              <div className="metric-item-name">API 응답속도</div>
              <div>
                <span className="metric-item-value">124ms</span>
                <span className="metric-item-trend up">-8ms</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">에러율</div>
              <div>
                <span className="metric-item-value">0.12%</span>
                <span className="metric-item-trend up">-0.03%</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">페이지 로딩 시간</div>
              <div>
                <span className="metric-item-value">1.8초</span>
                <span className="metric-item-trend down">+0.2초</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-name">가동률</div>
              <div>
                <span className="metric-item-value">99.98%</span>
                <span className="metric-item-trend up">+0.01%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="alert-section">
        <div className="section-title">주요 알림</div>
        <div className="alert-list">
          <div className="alert-item">
            <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div className="alert-content">
              <div className="alert-title">고객 유지율 하락 경고</div>
              <div className="alert-description">
                30일 유지율이 목표 대비 1.5% 하락했습니다. 리텐션 개선 전략 검토가 필요합니다.
              </div>
              <div className="alert-time">2시간 전</div>
            </div>
          </div>
          <div className="alert-item warning">
            <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div className="alert-content">
              <div className="alert-title">페이지 로딩 시간 증가</div>
              <div className="alert-description">
                평균 페이지 로딩 시간이 1.8초로 증가했습니다. 성능 최적화를 고려해주세요.
              </div>
              <div className="alert-time">5시간 전</div>
            </div>
          </div>
          <div className="alert-item info">
            <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div className="alert-content">
              <div className="alert-title">프리미엄 CTA 실험 곧 종료</div>
              <div className="alert-description">
                프리미엄 전환 CTA 버튼 색상 테스트가 3일 후 종료됩니다. 결과 분석 준비가 필요합니다.
              </div>
              <div className="alert-time">1일 전</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
