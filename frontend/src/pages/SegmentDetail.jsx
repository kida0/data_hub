import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import TimeRangeSelector from '../components/TimeRangeSelector'
import CollapsibleSection from '../components/CollapsibleSection'
import ChartContainer from '../components/ChartContainer'
import { createDataset, chartColors } from '../utils/chartConfig'
import './SegmentDetail.css'
import { segmentsAPI } from '../services/api'

function SegmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [segment, setSegment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    fetchSegmentDetail()
  }, [id])

  const fetchSegmentDetail = async () => {
    try {
      setLoading(true)
      const response = await segmentsAPI.getById(id)
      setSegment(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching segment detail:', err)
      setError('세그먼트 상세 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 트렌드 차트 데이터 생성
  const generateTrendData = () => {
    const days = parseInt(timeRange)
    const dates = []
    const users = []
    
    const today = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }))
      
      const baseValue = 40000
      const trend = (days - 1 - i) * 100
      const variance = Math.random() * 1000
      users.push(Math.floor(baseValue + trend + variance))
    }
    
    return { dates, users }
  }

  const trendData = generateTrendData()

  const trendChartConfig = {
    labels: trendData.dates,
    datasets: [createDataset('활성 유저 수', trendData.users, chartColors.primary, 'line')]
  }

  // 연령대 분포 차트
  const ageChartConfig = {
    labels: ['10대', '20대', '30대', '40대', '50대+'],
    datasets: [{
      data: [8, 32, 35, 18, 7],
      backgroundColor: [
        chartColors.primary,
        '#4c51bf',
        '#6366f1',
        '#a5b4fc',
        '#ddd6fe'
      ],
      borderWidth: 0
    }]
  }

  // 디바이스 분포 차트
  const deviceChartConfig = {
    labels: ['iOS', 'Android', 'Web', 'Desktop App'],
    datasets: [{
      label: '사용자 비율',
      data: [42, 38, 15, 5],
      backgroundColor: [
        chartColors.primary,
        '#4c51bf',
        '#6366f1',
        '#a5b4fc'
      ],
      borderRadius: 8,
      borderWidth: 0
    }]
  }

  const deviceChartOptions = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      }
    }
  }

  if (loading) {
    return <div className="segment-detail-page"><div className="loading">로딩 중...</div></div>
  }

  if (error || !segment) {
    return <div className="segment-detail-page"><div className="error">{error || '세그먼트를 찾을 수 없습니다.'}</div></div>
  }

  return (
    <div className="segment-detail-page">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: 'Segment', onClick: () => navigate('/segments') },
          { label: '최근 30일 활성 유저', active: true }
        ]}
      />

      {/* Header */}
      <PageHeader
        title="최근 30일 활성 유저"
        subtitle="지난 30일 동안 1회 이상 로그인하고 핵심 기능을 사용한 활성 사용자 그룹입니다."
        actions={
          <>
            <button className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              사용자 추출
            </button>
            <button className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              편집
            </button>
          </>
        }
      />

      {/* Basic Info Cards */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">세그먼트 오너</div>
          <div className="info-value">
            <div className="owner-info">
              <div className="owner-avatar">키</div>
              <div className="owner-details">
                <div className="owner-name">키다</div>
                <div className="owner-role">Data Team · Data Analyst</div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">진행 캠페인</div>
          <div className="info-value">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="campaign-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                프리미엄 전환 캠페인
              </button>
              <button className="campaign-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                신규 기능 안내
              </button>
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">사용 상태</div>
          <div className="info-value">
            <span className="status-active">
              <span className="status-dot"></span>
              사용 중
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="detail-section">
        <div className="section-title">상세 정보</div>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">분류</div>
            <div className="detail-value">
              <Badge variant="category">User Behavior</Badge>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">태그</div>
            <div className="detail-value">
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <Badge variant="info">활성 유저</Badge>
                <Badge variant="info">마케팅</Badge>
                <Badge variant="info">리텐션</Badge>
              </div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">갱신 주기</div>
            <div className="detail-value">매일 자정 (KST)</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">생성일</div>
            <div className="detail-value">2023년 5월 20일</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">마지막 갱신</div>
            <div className="detail-value">2024년 12월 14일 00:05</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">데이터 소스</div>
            <div className="detail-value">user_sessions, user_events, feature_usage</div>
          </div>
        </div>
      </div>

      {/* Segment Conditions (Collapsible) */}
      <CollapsibleSection title="세그먼트 조건" defaultExpanded={true}>
        <div className="condition-list">
          <div className="condition-item">
            <span className="condition-field">최근 로그인</span>
            <span className="condition-operator-inline">is within</span>
            <span className="condition-value">30일 이내</span>
          </div>
          <div className="condition-operator">AND</div>
          <div className="condition-item">
            <span className="condition-field">세션 수</span>
            <span className="condition-operator-inline">≥</span>
            <span className="condition-value">3회</span>
          </div>
          <div className="condition-operator">AND</div>
          <div className="condition-item">
            <span className="condition-field">핵심 기능 사용</span>
            <span className="condition-operator-inline">≥</span>
            <span className="condition-value">1회</span>
          </div>
          <div className="condition-operator">AND</div>
          <div className="condition-item">
            <span className="condition-field">회원 등급</span>
            <span className="condition-operator-inline">in</span>
            <span className="condition-value">일반, 프리미엄</span>
          </div>
          <div className="condition-operator">AND</div>
          <div className="condition-item">
            <span className="condition-field">가입 경로</span>
            <span className="condition-operator-inline">is not</span>
            <span className="condition-value">테스트 계정</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard label="현재 세그먼트 규모" value="42,847" change="+5.2% from last week" changeType="positive" />
        <StatsCard label="전체 유저 대비 비율" value="68.3%" change="+2.1% from last week" changeType="positive" />
        <StatsCard label="평균 세션 시간" value="18.5분" change="+1.3분 from last week" changeType="positive" />
        <StatsCard label="30일 유지율" value="73.2%" change="-1.5% from last week" changeType="negative" />
      </div>

      {/* Trend Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="section-title">세그먼트 규모 트렌드</div>
          <div className="chart-controls">
            <TimeRangeSelector
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: '7', label: '7일' },
                { value: '30', label: '30일' },
                { value: '90', label: '90일' }
              ]}
            />
          </div>
        </div>
        <ChartContainer type="line" data={trendChartConfig} height={300} />
      </div>

      {/* Additional Charts */}
      <div className="charts-grid">
        <div className="chart-box">
          <div className="chart-box-title">연령대 분포</div>
          <ChartContainer type="doughnut" data={ageChartConfig} height={250} />
        </div>
        <div className="chart-box">
          <div className="chart-box-title">디바이스 분포</div>
          <ChartContainer type="bar" data={deviceChartConfig} options={deviceChartOptions} height={250} />
        </div>
      </div>
    </div>
  )
}

export default SegmentDetail

