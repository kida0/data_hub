import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import { formatNumber, formatDate } from '../utils/formatters'
import './Segments.css'
import { segmentsAPI } from '../services/api'

function Segments() {
  const navigate = useNavigate()
  const [segments, setSegments] = useState([])
  const [stats, setStats] = useState({
    total_segments: 0,
    total_customers: 0,
    active_customers: 0,
    at_risk_customers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const itemsPerPage = 10

  useEffect(() => {
    fetchSegments()
    fetchStats()
  }, [])

  const fetchSegments = async () => {
    try {
      setLoading(true)
      const response = await segmentsAPI.getAll({ limit: 100 })
      setSegments(response.data.items)
      setError(null)
    } catch (err) {
      console.error('Error fetching segments:', err)
      setError('세그먼트를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await segmentsAPI.getStats()
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleRowClick = (segmentId) => {
    navigate(`/segments/${segmentId}`)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getChannelIcon = (channel) => {
    if (!channel) return null
    const lowerChannel = channel.toLowerCase()
    if (lowerChannel.includes('이메일') || lowerChannel.includes('email')) return 'email'
    if (lowerChannel.includes('푸시') || lowerChannel.includes('push')) return 'push'
    if (lowerChannel.includes('sms')) return 'sms'
    return 'email'
  }

  const formatRelativeDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    const formatted = formatDate(dateString, 'medium')

    if (diffDays === 0) return `오늘 (${formatted})`
    if (diffDays === 1) return `1일 전 (${formatted})`
    if (diffDays < 7) return `${diffDays}일 전 (${formatted})`
    if (diffDays < 14) return `1주일 전 (${formatted})`
    return `${Math.floor(diffDays / 7)}주일 전 (${formatted})`
  }

  const filteredSegments = segments.filter((segment) => {
    const matchesSearch =
      segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || segment.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const sortedSegments = [...filteredSegments].sort((a, b) => {
    if (!sortField) return 0

    let aValue, bValue

    if (sortField === 'customer_count') {
      aValue = a.customer_count || 0
      bValue = b.customer_count || 0
    } else if (sortField === 'category') {
      aValue = a.category || ''
      bValue = b.category || ''
    } else if (sortField === 'last_touch_date') {
      aValue = a.last_touch_date ? new Date(a.last_touch_date).getTime() : 0
      bValue = b.last_touch_date ? new Date(b.last_touch_date).getTime() : 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedSegments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSegments = sortedSegments.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="segments-page">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="segments-page">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="segments-page">
      <PageHeader title="Segment" description="고객 세그먼트별 주요 지표를 모니터링하고 CRM 캠페인을 계획할 수 있습니다." />

      {/* Overview Stats */}
      <div className="overview-section">
        <div className="stats-grid">
          <StatsCard label="전체 세그먼트" value={stats.total_segments} change="등록된 세그먼트" changeType="neutral" />
          <StatsCard
            label="신규 고객"
            value={`${stats.total_customers.toLocaleString()}명`}
            change="지난 7일간 가입한 고객"
            changeType="neutral"
          />
          <StatsCard
            label="활성 고객"
            value={formatNumber(stats.active_customers)}
            change="지난 7일간 방문한 고객"
            changeType="positive"
          />
          <StatsCard
            label="이탈 위험 고객"
            value={`${formatNumber(stats.at_risk_customers)}명`}
            change="지난 28일간 방문하지 않은 고객"
            changeType="negative"
          />
        </div>
      </div>

      {/* Segments Table */}
      <div className="segments-section">
        <div className="segments-controls">
          <div className="controls-left">
            <div className="section-title" style={{ marginBottom: 0 }}>
              세그먼트 목록
            </div>
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b95a1" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <select
              className="filter-dropdown"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="">전체 분류</option>
              <option value="리텐션">리텐션</option>
              <option value="신규 획득">신규 획득</option>
              <option value="재활성화">재활성화</option>
              <option value="VIP 관리">VIP 관리</option>
            </select>
          </div>
          <div className="search-filter">
            <button className="btn-compact btn-primary" onClick={() => navigate('/segments/new')}>
              <span>+ 새 세그먼트</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th style={{ width: '240px' }}>세그먼트명</th>
                <th
                  className="align-right sortable-header"
                  style={{ width: '110px', cursor: 'pointer' }}
                  onClick={() => handleSort('customer_count')}
                >
                  <div className="header-content" style={{ justifyContent: 'flex-end' }}>
                    고객 수
                    {sortField === 'customer_count' && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    )}
                  </div>
                </th>
                <th className="align-right" style={{ width: '110px' }}>
                  주요지표 1
                </th>
                <th className="align-right" style={{ width: '110px' }}>
                  주요지표 2
                </th>
                <th className="align-right" style={{ width: '110px' }}>
                  주요지표 3
                </th>
                <th
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => handleSort('category')}
                  className="sortable-header"
                >
                  <div className="header-content">
                    분류
                    {sortField === 'category' && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  style={{ width: '180px', cursor: 'pointer' }}
                  onClick={() => handleSort('last_touch_date')}
                  className="sortable-header"
                >
                  <div className="header-content">
                    마지막 터치
                    {sortField === 'last_touch_date' && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSegments.length > 0 ? (
                currentSegments.map((segment, index) => {
                  const channelIcon = getChannelIcon(segment.last_touch_channel)
                  const formattedDate = formatRelativeDate(segment.last_touch_date)
                  const rowNumber = startIndex + index + 1

                  return (
                    <tr
                      key={segment.id}
                      className="clickable-row"
                      onClick={() => handleRowClick(segment.id)}
                    >
                      <td className="segment-number">{String(rowNumber).padStart(3, '0')}</td>
                      <td>
                        <div className="segment-name-cell">
                          <div className="segment-name-text">
                            {segment.name}
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{ marginLeft: '8px', verticalAlign: 'middle' }}
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </div>
                          <div className="segment-desc-text">{segment.description}</div>
                        </div>
                      </td>
                      <td className="align-right">
                        <span className="metric-cell">
                          {segment.customer_count?.toLocaleString()}
                          <span className="metric-unit-small">명</span>
                        </span>
                      </td>
                      <td className="align-right">
                        <span className="metric-cell">{segment.metric1_value}</span>
                        <div className="segment-desc-text" style={{ marginTop: '2px' }}>
                          {segment.metric1_label}
                        </div>
                      </td>
                      <td className="align-right">
                        <span className="metric-cell">{segment.metric2_value}</span>
                        <div className="segment-desc-text" style={{ marginTop: '2px' }}>
                          {segment.metric2_label}
                        </div>
                      </td>
                      <td className="align-right">
                        <span className="metric-cell">{segment.metric3_value}</span>
                        <div className="segment-desc-text" style={{ marginTop: '2px' }}>
                          {segment.metric3_label}
                        </div>
                      </td>
                      <td>
                        <Badge variant="category">{segment.category}</Badge>
                      </td>
                      <td>
                        {segment.last_touch_channel ? (
                          <div className="last-touch-cell">
                            <div className="touch-channel">
                              <svg className="touch-icon-small" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                {channelIcon === 'email' && (
                                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                )}
                                {channelIcon === 'push' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>}
                                {channelIcon === 'sms' && (
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                )}
                              </svg>
                              {segment.last_touch_channel}
                            </div>
                            <div className="touch-date">{formattedDate}</div>
                          </div>
                        ) : (
                          <div className="last-touch-cell">
                            <div className="no-touch">발송 이력 없음</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1
              if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <div key={pageNum} className="pagination-ellipsis">
                    ...
                  </div>
                )
              }
              return null
            })}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Segments
