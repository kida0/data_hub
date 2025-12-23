import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import './CreateInsight.css'

function CreateInsight() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedExperiment, setSelectedExperiment] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: 'A/B Test',
    summary: '',
    findings: '',
    recommendations: '',
    impactScore: 3,
    attachCharts: true
  })

  // Mock data: 완료된 실험 목록
  const completedExperiments = [
    {
      id: 1,
      name: '신규 가입 쿠폰 (20% 할인)',
      description: '가입 후 24시간 내 사용 가능한 할인 쿠폰',
      objective: '첫 구매 전환',
      type: 'Campaign',
      period: '2024-10-01 ~ 2024-11-30',
      status: 'completed',
      hypothesis: '신규 가입자에게 첫 구매 시 사용할 수 있는 할인 쿠폰을 제공하면 전환율이 증가할 것이다.',
      baseline: {
        metric: '전환율',
        value: 10.67,
        sampleSize: 15234
      },
      result: {
        metric: '전환율',
        value: 13.81,
        change: '+29.4%',
        sampleSize: 14892,
        confidence: 99.2,
        pValue: 0.001
      },
      segments: [
        { name: '전체', baseline: 10.67, result: 13.81, change: 29.4 },
        { name: '20대', baseline: 12.3, result: 16.2, change: 31.7 },
        { name: '30대', baseline: 11.5, result: 14.8, change: 28.7 },
        { name: '40대', baseline: 9.2, result: 11.9, change: 29.3 },
        { name: '모바일', baseline: 11.8, result: 15.3, change: 29.7 },
        { name: '데스크톱', baseline: 9.1, result: 11.8, change: 29.7 }
      ],
      roi: {
        investment: 8500000,
        revenue: 20910000,
        roi: 246,
        paybackPeriod: '18일'
      }
    },
    {
      id: 2,
      name: '신규 온보딩 플로우 개선',
      description: '튜토리얼 단계 축소 + 인터랙티브 강화',
      objective: '첫 구매 전환',
      type: 'A/B Test',
      period: '2024-11-15 ~ 2024-12-10',
      status: 'completed',
      hypothesis: '온보딩 단계를 줄이고 인터랙티브 요소를 강화하면 사용자 경험이 개선되어 전환율이 증가할 것이다.',
      baseline: {
        metric: '전환율',
        value: 10.68,
        sampleSize: 8234
      },
      result: {
        metric: '전환율',
        value: 15.2,
        change: '+42.3%',
        sampleSize: 8156,
        confidence: 99.8,
        pValue: 0.0001
      },
      segments: [
        { name: '전체', baseline: 10.68, result: 15.2, change: 42.3 },
        { name: '20대', baseline: 11.2, result: 17.1, change: 52.7 },
        { name: '30대', baseline: 10.9, result: 15.8, change: 45.0 },
        { name: '40대', baseline: 9.8, result: 13.2, change: 34.7 },
        { name: '모바일', baseline: 12.1, result: 18.3, change: 51.2 },
        { name: '데스크톱', baseline: 8.9, result: 11.5, change: 29.2 }
      ],
      roi: {
        investment: 3200000,
        revenue: 13696000,
        roi: 428,
        paybackPeriod: '12일'
      }
    },
    {
      id: 3,
      name: 'VIP 고객 목금 특가 프로모션',
      description: '재구매 패턴 분석 기반 타이밍 최적화',
      objective: '재구매 촉진',
      type: 'Campaign',
      period: '2024-11-01 ~ 2024-11-30',
      status: 'completed',
      hypothesis: 'VIP 고객의 재구매 패턴을 분석하여 목요일/금요일에 특가 프로모션을 진행하면 재구매율이 증가할 것이다.',
      baseline: {
        metric: '재구매율',
        value: 46.5,
        sampleSize: 3421
      },
      result: {
        metric: '재구매율',
        value: 62.4,
        change: '+34.2%',
        sampleSize: 3387,
        confidence: 98.5,
        pValue: 0.003
      },
      segments: [
        { name: '전체', baseline: 46.5, result: 62.4, change: 34.2 },
        { name: 'VIP Gold', baseline: 52.3, result: 71.2, change: 36.1 },
        { name: 'VIP Silver', baseline: 43.8, result: 58.1, change: 32.6 },
        { name: '패션', baseline: 48.2, result: 65.7, change: 36.3 },
        { name: '뷰티', baseline: 51.1, result: 68.3, change: 33.7 },
        { name: '가전', baseline: 38.9, result: 51.2, change: 31.6 }
      ],
      roi: {
        investment: 4800000,
        revenue: 25008000,
        roi: 521,
        paybackPeriod: '8일'
      }
    }
  ]

  const handleExperimentSelect = (experiment) => {
    setSelectedExperiment(experiment)
    // 자동으로 일부 폼 데이터 채우기
    setFormData(prev => ({
      ...prev,
      category: experiment.objective,
      type: experiment.type,
      summary: `${experiment.name} 실험을 ${experiment.period} 기간 동안 진행한 결과, ${experiment.result.metric}이(가) ${experiment.baseline.value}%에서 ${experiment.result.value}%로 ${experiment.result.change} 향상되었습니다.`
    }))
    setCurrentStep(2)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // TODO: API 연동
    console.log('Saving insight:', { experiment: selectedExperiment, formData })
    alert('인사이트가 저장되었습니다!')
    navigate('/insights')
  }

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">실험 선택</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">결과 리뷰</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">인사이트 작성</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
        <div className="step-number">4</div>
        <div className="step-label">미리보기</div>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="step-content">
      <div className="section-header">
        <h2>완료된 실험 선택</h2>
        <p>인사이트로 만들 실험을 선택하세요</p>
      </div>

      <div className="experiments-grid">
        {completedExperiments.map(exp => (
          <div
            key={exp.id}
            className="experiment-card"
            onClick={() => handleExperimentSelect(exp)}
          >
            <div className="experiment-header">
              <h3>{exp.name}</h3>
              <Badge variant={exp.type === 'A/B Test' ? 'ab-test' : 'campaign'}>{exp.type}</Badge>
            </div>
            <p className="experiment-desc">{exp.description}</p>
            <div className="experiment-meta">
              <div className="meta-item">
                <span className="meta-label">목표</span>
                <span className="meta-value">{exp.objective}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">기간</span>
                <span className="meta-value">{exp.period}</span>
              </div>
            </div>
            <div className="experiment-result">
              <div className="result-metric">
                <span className="result-label">{exp.result.metric}</span>
                <div className="result-values">
                  <span className="baseline">{exp.baseline.value}%</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span className="result">{exp.result.value}%</span>
                </div>
              </div>
              <div className="result-change positive">
                {exp.result.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => {
    if (!selectedExperiment) return null

    return (
      <div className="step-content">
        <div className="section-header">
          <h2>실험 결과 리뷰</h2>
          <p>{selectedExperiment.name}의 상세 결과를 확인하세요</p>
        </div>

        {/* 실험 기본 정보 */}
        <div className="review-section">
          <h3 className="review-title">실험 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">실험명</span>
              <span className="info-value">{selectedExperiment.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">목표</span>
              <span className="info-value">{selectedExperiment.objective}</span>
            </div>
            <div className="info-item">
              <span className="info-label">타입</span>
              <Badge variant={selectedExperiment.type === 'A/B Test' ? 'ab-test' : 'campaign'}>
                {selectedExperiment.type}
              </Badge>
            </div>
            <div className="info-item">
              <span className="info-label">기간</span>
              <span className="info-value">{selectedExperiment.period}</span>
            </div>
          </div>
          <div className="hypothesis-box">
            <span className="hypothesis-label">가설</span>
            <p className="hypothesis-text">{selectedExperiment.hypothesis}</p>
          </div>
        </div>

        {/* 주요 결과 */}
        <div className="review-section">
          <h3 className="review-title">주요 결과</h3>
          <div className="result-summary">
            <div className="result-card">
              <div className="result-card-label">Baseline</div>
              <div className="result-card-value">{selectedExperiment.baseline.value}%</div>
              <div className="result-card-meta">샘플: {selectedExperiment.baseline.sampleSize.toLocaleString()}</div>
            </div>
            <div className="result-arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
            <div className="result-card highlight">
              <div className="result-card-label">Result</div>
              <div className="result-card-value">{selectedExperiment.result.value}%</div>
              <div className="result-card-meta">샘플: {selectedExperiment.result.sampleSize.toLocaleString()}</div>
            </div>
            <div className="result-change-large positive">
              <div className="change-value">{selectedExperiment.result.change}</div>
              <div className="change-label">개선</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">신뢰도</div>
              <div className="stat-value">{selectedExperiment.result.confidence}%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">P-value</div>
              <div className="stat-value">{selectedExperiment.result.pValue}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">ROI</div>
              <div className="stat-value">{selectedExperiment.roi.roi}%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">회수 기간</div>
              <div className="stat-value">{selectedExperiment.roi.paybackPeriod}</div>
            </div>
          </div>
        </div>

        {/* 세그먼트별 결과 */}
        <div className="review-section">
          <h3 className="review-title">세그먼트별 성과</h3>
          <div className="segments-table">
            <table>
              <thead>
                <tr>
                  <th>세그먼트</th>
                  <th>Baseline</th>
                  <th>Result</th>
                  <th>변화</th>
                  <th>성과</th>
                </tr>
              </thead>
              <tbody>
                {selectedExperiment.segments.map((seg, idx) => (
                  <tr key={idx}>
                    <td className="segment-name">{seg.name}</td>
                    <td>{seg.baseline}%</td>
                    <td>{seg.result}%</td>
                    <td className="change-value">+{(seg.result - seg.baseline).toFixed(2)}%p</td>
                    <td>
                      <div className={`change-badge ${seg.change >= 35 ? 'excellent' : seg.change >= 30 ? 'good' : 'normal'}`}>
                        +{seg.change}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="step-actions">
          <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
            이전
          </button>
          <button className="btn-primary" onClick={() => setCurrentStep(3)}>
            다음: 인사이트 작성
          </button>
        </div>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="step-content">
      <div className="section-header">
        <h2>인사이트 작성</h2>
        <p>실험 결과를 바탕으로 인사이트를 작성하세요</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label className="form-label required">제목</label>
          <input
            type="text"
            className="form-input"
            placeholder="예: 신규 가입 쿠폰이 첫 구매 전환에 미치는 영향"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">카테고리 (목표)</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="첫 구매 전환">첫 구매 전환</option>
              <option value="재구매 촉진">재구매 촉진</option>
              <option value="이탈 방지">이탈 방지</option>
              <option value="업셀링">업셀링</option>
              <option value="추천 유입">추천 유입</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">타입</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="A/B Test">A/B Test</option>
              <option value="Campaign">Campaign</option>
              <option value="Feature">Feature</option>
              <option value="Analysis">Analysis</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">실험 요약</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="실험의 목적과 결과를 간단히 요약하세요"
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">주요 발견 (Key Findings)</label>
          <textarea
            className="form-textarea"
            rows="6"
            placeholder="&#8226; 실험을 통해 발견한 핵심 인사이트를 작성하세요&#10;&#8226; 정량적 데이터와 함께 구체적으로 작성하세요&#10;&#8226; 예상치 못한 발견이나 특이사항도 포함하세요"
            value={formData.findings}
            onChange={(e) => handleInputChange('findings', e.target.value)}
          />
          <div className="form-hint">
            💡 Tip: 세그먼트별 차이, 통계적 유의성, ROI 등을 포함하면 좋습니다
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">권장 액션 (Recommendations)</label>
          <textarea
            className="form-textarea"
            rows="5"
            placeholder="&#8226; 이 인사이트를 바탕으로 다음에 취할 액션을 제안하세요&#10;&#8226; 확대 적용, 추가 테스트, 개선 방향 등을 포함하세요"
            value={formData.recommendations}
            onChange={(e) => handleInputChange('recommendations', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">영향도 평가 (Impact Score)</label>
          <div className="impact-score-selector">
            {[1, 2, 3, 4, 5].map(score => (
              <div
                key={score}
                className={`impact-option ${formData.impactScore === score ? 'selected' : ''}`}
                onClick={() => handleInputChange('impactScore', score)}
              >
                <div className="impact-number">{score}</div>
                <div className="impact-label">
                  {score === 1 && '낮음'}
                  {score === 2 && '보통'}
                  {score === 3 && '중간'}
                  {score === 4 && '높음'}
                  {score === 5 && '매우 높음'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.attachCharts}
              onChange={(e) => handleInputChange('attachCharts', e.target.checked)}
            />
            <span>실험 결과 차트 및 데이터 첨부</span>
          </label>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setCurrentStep(2)}>
          이전
        </button>
        <button className="btn-primary" onClick={() => setCurrentStep(4)}>
          다음: 미리보기
        </button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="step-content">
      <div className="section-header">
        <h2>미리보기</h2>
        <p>작성한 인사이트를 확인하고 저장하세요</p>
      </div>

      <div className="preview-container">
        <div className="preview-header">
          <h1 className="preview-title">{formData.title || '(제목 없음)'}</h1>
          <div className="preview-meta">
            <Badge variant={formData.type === 'A/B Test' ? 'ab-test' : 'campaign'}>{formData.type}</Badge>
            <span className="preview-category">{formData.category}</span>
            <span className="preview-impact">Impact Score: {formData.impactScore}/5</span>
          </div>
        </div>

        <div className="preview-section">
          <h3>실험 정보</h3>
          {selectedExperiment && (
            <div className="preview-experiment">
              <div className="preview-row">
                <span className="preview-label">실험명:</span>
                <span>{selectedExperiment.name}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">기간:</span>
                <span>{selectedExperiment.period}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">결과:</span>
                <span className="preview-result">
                  {selectedExperiment.baseline.value}% → {selectedExperiment.result.value}%
                  <span className="positive"> ({selectedExperiment.result.change})</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="preview-section">
          <h3>요약</h3>
          <p className="preview-text">{formData.summary || '(요약 없음)'}</p>
        </div>

        <div className="preview-section">
          <h3>주요 발견</h3>
          <p className="preview-text whitespace-pre-line">{formData.findings || '(주요 발견 없음)'}</p>
        </div>

        <div className="preview-section">
          <h3>권장 액션</h3>
          <p className="preview-text whitespace-pre-line">{formData.recommendations || '(권장 액션 없음)'}</p>
        </div>

        {formData.attachCharts && selectedExperiment && (
          <div className="preview-section">
            <h3>첨부 데이터</h3>
            <div className="attached-data">
              <div className="data-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>세그먼트별 성과 차트</span>
              </div>
              <div className="data-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                <span>상세 통계 데이터</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setCurrentStep(3)}>
          수정
        </button>
        <button className="btn-primary" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  )

  return (
    <div className="create-insight-page">
      <PageHeader
        title="새 인사이트 생성"
        description="완료된 실험 결과를 인사이트로 저장하세요"
        actions={
          <button className="btn-secondary" onClick={() => navigate('/insights')}>
            <span>취소</span>
          </button>
        }
      />

      {renderStepIndicator()}

      <div className="create-insight-container">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  )
}

export default CreateInsight
