import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import TimeRangeSelector from '../components/TimeRangeSelector'
import ChartContainer from '../components/ChartContainer'
import { createDataset, chartColors } from '../utils/chartConfig'
import './MetricDetail.css'
import { metricsAPI } from '../services/api'

function MetricDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [metric, setMetric] = useState(null)
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    fetchMetricDetail()
    fetchTimeSeriesData()
  }, [id])

  const fetchMetricDetail = async () => {
    try {
      setLoading(true)
      const response = await metricsAPI.getById(id)
      setMetric(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching metric detail:', err)
      setError('지표 상세 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTimeSeriesData = async () => {
    try {
      const limit = parseInt(timeRange)
      const response = await metricsAPI.getTimeSeries(id, { limit })
      setTimeSeriesData(response.data)
    } catch (err) {
      console.error('Error fetching time series data:', err)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTimeSeriesData()
    }
  }, [timeRange])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleEditClick = () => {
    navigate(`/metrics/${id}/edit`)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditData({})
  }

  const handleSaveEdit = async () => {
    try {
      setSaving(true)
      await metricsAPI.update(id, editData)
      await fetchMetricDetail()
      setIsEditMode(false)
      setError(null)
    } catch (err) {
      console.error('Error updating metric:', err)
      setError('지표 업데이트에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return <div className="metric-detail-page"><div className="loading">로딩 중...</div></div>
  }

  if (error || !metric) {
    return <div className="metric-detail-page"><div className="error">{error || '지표를 찾을 수 없습니다.'}</div></div>
  }

  // 그래프 데이터 준비
  const hasVisitorCount = timeSeriesData.some(point => point.visitor_count !== null && point.visitor_count !== undefined)

  const chartData = {
    labels: timeSeriesData.map(point => {
      const date = new Date(point.timestamp)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    datasets: hasVisitorCount ? [
      {
        label: '결제 화면 진입 수',
        data: timeSeriesData.map(point => point.visitor_count),
        backgroundColor: 'rgba(2, 7, 96, 0.1)',
        borderColor: 'rgba(2, 7, 96, 0.3)',
        borderWidth: 1,
        type: 'bar',
        yAxisID: 'y',
        order: 2
      },
      {
        label: 'CVR (%)',
        data: timeSeriesData.map(point => point.value),
        type: 'line',
        borderColor: '#020760',
        backgroundColor: 'rgba(2, 7, 96, 0.05)',
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#020760',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
        yAxisID: 'y1',
        order: 1
      }
    ] : [
      createDataset(metric.name, timeSeriesData.map(point => point.value), chartColors.primary, 'line')
    ]
  }

  const chartOptions = hasVisitorCount ? {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Pretendard',
            size: 13,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(25, 31, 40, 0.95)',
        titleFont: {
          family: 'Pretendard',
          size: 13,
          weight: '600'
        },
        bodyFont: {
          family: 'Pretendard',
          size: 13
        },
        padding: 12,
        borderColor: '#e5e8eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += context.parsed.y.toLocaleString() + '명';
              } else {
                label += parseFloat(context.parsed.y.toFixed(2)) + '%';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Pretendard',
            size: 12
          },
          color: '#8b95a1'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: {
          color: '#f2f4f6'
        },
        ticks: {
          font: {
            family: 'Pretendard',
            size: 12
          },
          color: '#8b95a1',
          callback: function(value) {
            return value.toLocaleString() + '명';
          }
        },
        title: {
          display: true,
          text: '결제 화면 진입 수',
          font: {
            family: 'Pretendard',
            size: 13,
            weight: '600'
          },
          color: '#4e5968'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            family: 'Pretendard',
            size: 12
          },
          color: '#8b95a1',
          callback: function(value) {
            return parseFloat(value.toFixed(2)) + '%';
          }
        },
        title: {
          display: true,
          text: 'CVR (%)',
          font: {
            family: 'Pretendard',
            size: 13,
            weight: '600'
          },
          color: '#4e5968'
        }
      }
    }
  } : {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${parseFloat(context.parsed.y.toFixed(2))}${metric.unit || ''}`
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return parseFloat(value.toFixed(2)) + (metric.unit || '')
          }
        }
      }
    }
  }

  return (
    <div className="metric-detail-page">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: 'Metric', onClick: () => navigate('/metrics') },
          { label: metric.name, active: true },
        ]}
      />

      {/* Header */}
      <PageHeader
        title={metric.name}
        subtitle={metric.description}
        actions={
          isEditMode ? (
            <>
              <button className="btn btn-secondary" onClick={handleCancelEdit} disabled={saving}>
                취소
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
                버전 기록
              </button>
              <button className="btn btn-primary" onClick={handleEditClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                편집
              </button>
            </>
          )
        }
      />

      {/* Basic Info Cards */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">메트릭 오너</div>
          <div className="info-value">
            <div className="owner-info">
              <div className="owner-avatar">키</div>
              <div className="owner-details">
                <div className="owner-name">{metric.metric_owner || '키다'}</div>
                <div className="owner-role">Data Team · Data Analyst</div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">지표 중요도</div>
          <div className="info-value">
            {metric.priority ? (
              <span className={`priority-badge priority-${metric.priority.toLowerCase()}`}>{metric.priority}</span>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">카테고리</div>
          <div className="info-value">
            {metric.category ? <Badge variant="category">{metric.category}</Badge> : '-'}
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">상태</div>
          <div className="info-value">
            {isEditMode ? (
              <select
                value={editData.status}
                onChange={(e) => handleEditChange('status', e.target.value)}
                className="form-select"
                style={{ width: '100%', padding: '6px 12px' }}
              >
                <option value="활성화">활성화</option>
                <option value="비활성화">비활성화</option>
                <option value="주의">주의</option>
              </select>
            ) : metric.status === '활성화' ? (
              <span className="status-active">
                <span className="status-dot"></span>
                활성화
              </span>
            ) : metric.status === '주의' ? (
              <span className="status-warning">
                <span className="status-dot"></span>
                주의
              </span>
            ) : (
              <span className="status-inactive">
                <span className="status-dot"></span>
                비활성화
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="detail-section">
        <div className="section-title">상세 정보</div>
        <div className="detail-grid">
          <div className="detail-item detail-item-full">
            <div className="detail-label">계산 로직</div>
            <div className="detail-value">{metric.calculation_logic || '-'}</div>
          </div>
          <div className="detail-item detail-item-full">
            <div className="detail-label">데이터 소스</div>
            <div className="detail-value">
              {isEditMode ? (
                <textarea
                  value={editData.data_source}
                  onChange={(e) => handleEditChange('data_source', e.target.value)}
                  className="form-textarea"
                  placeholder="예: payment_events, user_journey_logs"
                  rows="2"
                  style={{ width: '100%' }}
                />
              ) : (
                metric.data_source || '데이터팀에서 설정 예정'
              )}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">집계 기간</div>
            <div className="detail-value">
              {isEditMode ? (
                <input
                  type="text"
                  value={editData.aggregation_period}
                  onChange={(e) => handleEditChange('aggregation_period', e.target.value)}
                  className="form-input"
                  placeholder="예: 일별, 주별, 월별"
                  style={{ width: '100%' }}
                />
              ) : (
                metric.aggregation_period || '데이터팀에서 설정 예정'
              )}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">지표값</div>
            <div className="detail-value">
              {isEditMode ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    step="any"
                    value={editData.value}
                    onChange={(e) => handleEditChange('value', e.target.value)}
                    className="form-input"
                    placeholder="지표값"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    value={editData.unit}
                    onChange={(e) => handleEditChange('unit', e.target.value)}
                    className="form-input"
                    placeholder="단위"
                    style={{ width: '80px' }}
                  />
                </div>
              ) : metric.value !== null && metric.value !== undefined ? (
                <>
                  {metric.value}
                  {metric.unit && <span style={{ marginLeft: '4px' }}>{metric.unit}</span>}
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">버전</div>
            <div className="detail-value">
              <span className="version">{metric.version || '-'}</span>
            </div>
          </div>
          {metric.alert_settings && (
            <div className="detail-item">
              <div className="detail-label">Alert 설정</div>
              <div className="detail-value">{metric.alert_settings}</div>
            </div>
          )}
          <div className="detail-item">
            <div className="detail-label">생성일</div>
            <div className="detail-value">{formatDate(metric.created_at)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">마지막 업데이트</div>
            <div className="detail-value">{formatDate(metric.updated_at)}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          label="현재 지표값"
          value={metric.value !== null && metric.value !== undefined ? `${metric.value}${metric.unit || ''}` : '-'}
          change="+5.2% from last week"
          changeType="positive"
        />
        <StatsCard
          label="30일 평균"
          value={timeSeriesData.length > 0 ? `${(timeSeriesData.reduce((sum, p) => sum + p.value, 0) / timeSeriesData.length).toFixed(2)}${metric.unit || ''}` : '-'}
          change="+3.1% from previous"
          changeType="positive"
        />
        <StatsCard
          label="30일 최고값"
          value={timeSeriesData.length > 0 ? `${Math.max(...timeSeriesData.map(p => p.value))}${metric.unit || ''}` : '-'}
          change="+8.5% from previous"
          changeType="positive"
        />
        <StatsCard
          label="30일 최저값"
          value={timeSeriesData.length > 0 ? `${Math.min(...timeSeriesData.map(p => p.value))}${metric.unit || ''}` : '-'}
          change="+2.1% from previous"
          changeType="positive"
        />
      </div>

      {/* Trend Chart */}
      {timeSeriesData.length > 0 && (
        <div className="chart-container">
          <div className="chart-header">
            <div className="section-title">지표 추이</div>
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
          <ChartContainer type="line" data={chartData} options={chartOptions} height={300} />
        </div>
      )}
    </div>
  )
}

export default MetricDetail
