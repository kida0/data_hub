import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import PageHeader from '../components/PageHeader'
import CollapsibleSection from '../components/CollapsibleSection'
import ChartContainer from '../components/ChartContainer'
import { createDataset, chartColors } from '../utils/chartConfig'
import './InsightDetail.css'

function InsightDetail() {
  const { category, id } = useParams()
  const navigate = useNavigate()

  // 일별 전환율 데이터 생성
  const generateConversionData = () => {
    const dates = []
    const withCoupon = []
    const baseline = []
    
    for (let i = 1; i <= 60; i++) {
      dates.push('Day ' + i)
      baseline.push(10.9 + (Math.random() - 0.5) * 1)
      withCoupon.push(14.8 + (Math.random() - 0.5) * 2)
    }
    
    return { dates, withCoupon, baseline }
  }

  const conversionData = generateConversionData()

  const chartConfig = {
    labels: conversionData.dates,
    datasets: [
      createDataset('쿠폰 캠페인', conversionData.withCoupon, chartColors.primary, 'line'),
      {
        label: '기준 (전년도)',
        data: conversionData.baseline,
        borderColor: '#8b95a1',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: false
      }
    ]
  }

  const chartOptions = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end'
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 15
        }
      },
      y: {
        beginAtZero: false,
        min: 8,
        max: 18
      }
    }
  }

  return (
    <div className="insight-detail-page">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: 'Insights', onClick: () => navigate('/insights') },
          { label: '첫 구매 전환' },
          { label: '신규 가입 쿠폰 (20% 할인)', active: true }
        ]}
      />

      {/* Header */}
      <PageHeader
        title="신규 가입 쿠폰 (20% 할인)"
        subtitle="가입 후 24시간 내 사용 가능한 할인 쿠폰"
        actions={
          <>
            <button className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              리포트 다운로드
            </button>
            <button className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              재실행
            </button>
          </>
        }
      >
        <div className="goal-tag">목표: 첫 구매 전환</div>
      </PageHeader>

      {/* Basic Info Cards */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">담당자</div>
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
          <div className="info-label">핵심 지표</div>
          <div className="info-value">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#020760' }}>13.8%</span>
              <span style={{ fontSize: '14px', color: '#00b368', fontWeight: 600 }}>+29.4%</span>
            </div>
            <div style={{ fontSize: '13px', color: '#4e5968', marginTop: '4px' }}>첫 구매 전환율</div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">진행 상태</div>
          <div className="info-value">
            <span className="status-service">
              <span className="status-dot"></span>
              서비스 중
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="detail-section">
        <div className="section-title">상세 정보</div>
        <div className="detail-grid-3col">
          <div className="detail-item">
            <div className="detail-label">실험 기간</div>
            <div className="detail-value">2024년 10월 1일 - 11월 30일</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">총 발급 수</div>
            <div className="detail-value">8,547건</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">ROI</div>
            <div className="detail-value">246%</div>
          </div>
        </div>
        <div className="detail-grid-3col" style={{ marginTop: '20px' }}>
          <div className="detail-item">
            <div className="detail-label">쿠폰 조건</div>
            <div className="detail-value">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="condition-btn">20% 할인</button>
                <button className="condition-btn">24시간 유효</button>
              </div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">대상 세그먼트</div>
            <div className="detail-value">
              <button className="segment-link-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                신규 가입자
              </button>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">대상 실험</div>
            <div className="detail-value">
              <button className="segment-link-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                A/B 테스트 #247
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      <CollapsibleSection title="주요 인사이트" defaultExpanded={true}>
          <div className="insight-item">
            <div className="insight-number">1</div>
            <div className="insight-content">
              <div className="insight-title">발급 후 첫 24시간이 골든타임</div>
              <div className="insight-description">
                전체 쿠폰 사용의 52%가 발급 후 첫 24시간 내 발생. 가입 직후 구매 의욕이 가장 높은 시점을 활용하는 것이 중요. 향후 캠페인은 발급 후 12시간, 48시간 시점에 리마인더 푸시 알림 추가 발송을 권장.
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">2</div>
            <div className="insight-content">
              <div className="insight-title">저녁 시간대 집중 현상</div>
              <div className="insight-description">
                쿠폰 사용의 43%가 19-22시 사이에 발생. 해당 시간대에 푸시 알림이나 리마인더를 보내면 효과 극대화 가능. 특히 발급 당일 저녁 시간대 타겟 메시지 강화 필요.
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">3</div>
            <div className="insight-content">
              <div className="insight-title">장기 효과도 긍정적</div>
              <div className="insight-description">
                쿠폰을 사용해 첫 구매를 한 고객의 30일 재구매율이 28%로, 쿠폰 미사용 첫 구매 고객(15%) 대비 1.87배 높음. 단기 전환뿐 아니라 장기 고객 가치(LTV)도 향상되어 지속 가능한 전략으로 확인됨.
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">4</div>
            <div className="insight-content">
              <div className="insight-title">최종 결론 및 권장 사항</div>
              <div className="insight-description">
                <strong>결론:</strong> 신규 가입 고객 대상 20% 할인 쿠폰 제공은 첫 구매 전환율을 유의미하게 개선하며, ROI 측면에서도 효과적인 전략임이 검증됨. 실험은 성공적이며 정식 서비스로 전환 권장.<br/><br/>
                <strong>권장 사항:</strong><br/>
                • 정식 서비스 전환: 현재 실험 설계를 그대로 정식 프로그램으로 운영<br/>
                • 발급 후 12시간, 48시간 시점에 리마인더 푸시 알림 추가 발송<br/>
                • 저녁 시간대(19-22시) 타겟 메시지 강화<br/>
                • 향후 실험: 유효 기간을 2일, 5일로 변경한 A/B 테스트를 통해 최적 기간 탐색
              </div>
            </div>
          </div>
      </CollapsibleSection>

      {/* Experiment Details Section */}
      <CollapsibleSection title="실험 상세" defaultExpanded={true}>
          <div className="insight-item">
            <div className="insight-number">1</div>
            <div className="insight-content">
              <div className="insight-title">실험 개요</div>
              <div className="insight-description">
                <strong>실험 이름:</strong> 신규 가입 고객 대상 24시간 한정 20% 할인 쿠폰 제공을 통한 첫 구매 전환율 개선<br/>
                <strong>실험 유형:</strong> 마케팅 캠페인 (쿠폰 프로모션)<br/>
                <strong>핵심 지표:</strong> 첫 구매 전환율 (목표: 기준 대비 10% 이상 개선)
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">2</div>
            <div className="insight-content">
              <div className="insight-title">실험 시기 및 대상</div>
              <div className="insight-description">
                <strong>진행 기간:</strong> 2024년 10월 1일 (화) - 11월 30일 (토), 총 60일간<br/>
                <strong>대상:</strong> 실험 기간 중 신규 가입한 전체 유저 8,547명<br/>
                <strong>쿠폰 조건:</strong> 가입 후 자동 발급, 20% 할인, 발급 후 24시간 유효
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">3</div>
            <div className="insight-content">
              <div className="insight-title">가설 및 실험 설계</div>
              <div className="insight-description">
                <strong>가설:</strong> 신규 가입 직후 할인 쿠폰을 제공하면 구매 장벽이 낮아져 첫 구매 전환율이 향상될 것<br/>
                <strong>초기 ICE 점수:</strong> Impact 8점, Confidence 7점, Ease 9점 = 총점 24점<br/>
                <strong>표본 크기:</strong> 8,547명 (실험군), 비교 기준은 전년도 동일 기간 신규 가입자 8,234명<br/>
                <strong>통계적 신뢰도:</strong> 95% (p-value &lt; 0.05)<br/>
                <strong>통계적 검증력:</strong> 89%
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">4</div>
            <div className="insight-content">
              <div className="insight-title">실험 결과</div>
              <div className="insight-description">
                <strong>첫 구매 전환율:</strong> 13.8% (기준 10.9% 대비 +29.4% 개선, 목표 초과 달성)<br/>
                <strong>쿠폰 사용률:</strong> 68.2% (발급 대비 5,830건 사용)<br/>
                <strong>ROI:</strong> 246% (투자 대비 긍정적 수익)<br/>
                <strong>목표 달성률:</strong> 147% (목표 전환율 12% 대비)
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-number">5</div>
            <div className="insight-content">
              <div className="insight-title">교란 요소</div>
              <div className="insight-description">
                <strong>10월 중순 경쟁사 프로모션:</strong> 실험 기간 중 주요 경쟁사가 유사한 할인 캠페인을 진행하여 일부 영향 가능성 존재. 그러나 해당 기간에도 전환율이 지속적으로 기준선 대비 높게 유지됨.<br/>
                <strong>11월 블랙프라이데이 효과:</strong> 11월 말 블랙프라이데이 시즌으로 인한 전반적인 구매 심리 상승. 해당 기간 데이터를 제외한 분석에서도 +25.1% 개선 확인.
              </div>
            </div>
          </div>
      </CollapsibleSection>

      {/* Trend Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="section-title">일별 전환율 추이</div>
        </div>
        <ChartContainer type="line" data={chartConfig} options={chartOptions} height={300} />
      </div>
    </div>
  )
}

export default InsightDetail

