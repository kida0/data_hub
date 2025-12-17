import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import './Metrics.css'
import { metricsAPI } from '../services/api'

function Metrics() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    warning: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    fetchMetrics()
    fetchStats()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await metricsAPI.getAll({ limit: 100 })
      setMetrics(response.data.items)
      setError(null)
    } catch (err) {
      console.error('Error fetching metrics:', err)
      setError('지표를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await metricsAPI.getStats()
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const filteredMetrics = metrics.filter((metric) => {
    const matchesSearch =
      metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      metric.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || metric.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredMetrics.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMetrics = filteredMetrics.slice(startIndex, endIndex)

  const handleRowClick = (id) => {
    navigate(`/metrics/${id}`)
  }

  if (loading) {
    return (
      <div className="metrics-page">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="metrics-page">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="metrics-page">
      <PageHeader title="Metric" description="서비스에서 수집하는 모든 지표를 확인할 수 있습니다." />

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard label="전체 지표" value={stats.total} change="전체 등록된 지표" />
        <StatsCard label="활성 지표" value={stats.active} change="현재 수집 중" />
        <StatsCard label="비활성 지표" value={stats.inactive} change="수집 중단됨" />
        <StatsCard label="주의 지표" value={stats.warning} change="모니터링 필요" />
      </div>

      {/* Data Table */}
      <div className="metrics-section">
        <div className="metrics-controls">
          <div className="controls-left">
            <div className="section-title" style={{ marginBottom: 0 }}>
              지표 목록
            </div>
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b95a1" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="지표 검색..."
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
              <option value="Engagement">Engagement</option>
              <option value="Revenue">Revenue</option>
              <option value="Retention">Retention</option>
              <option value="Acquisition">Acquisition</option>
              <option value="Product">Product</option>
            </select>
          </div>
          <div className="search-filter">
            <button className="btn-compact btn-secondary">
              <span>지표 관리</span>
            </button>
            <button className="btn-compact btn-primary" onClick={() => navigate('/metrics/new')}>
              <span>+ 새 지표</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th style={{ width: '200px' }}>지표명</th>
                <th>지표 설명</th>
                <th style={{ width: '100px' }}>중요도</th>
                <th style={{ width: '140px' }}>분류</th>
                <th style={{ width: '120px' }}>수집상태</th>
              </tr>
            </thead>
            <tbody>
              {currentMetrics.length > 0 ? (
                currentMetrics.map((metric) => (
                  <tr key={metric.id} className="clickable-row" onClick={() => handleRowClick(metric.id)}>
                    <td className="metric-number">{String(metric.id).padStart(3, '0')}</td>
                    <td className="metric-name">
                      {metric.name}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginLeft: '6px', verticalAlign: 'middle', color: '#020760' }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </td>
                    <td className="metric-description">{metric.description}</td>
                    <td>
                      <Badge variant={metric.priority === 'P0' ? 'error' : metric.priority === 'P1' ? 'warning' : 'default'}>
                        {metric.priority || '-'}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant="category">{metric.category}</Badge>
                    </td>
                    <td>
                      {metric.status === '활성화' ? (
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
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
              // Show first page, last page, current page and pages around current page
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

export default Metrics
