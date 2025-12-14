import { useState, useEffect } from 'react'
import './Metrics.css'
import { metricsAPI } from '../services/api'

function Metrics() {
  const [metrics, setMetrics] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    warning: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
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

  const filteredMetrics = metrics.filter(metric =>
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredMetrics.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMetrics = filteredMetrics.slice(startIndex, endIndex)

  if (loading) {
    return <div className="metrics-page"><div className="loading">로딩 중...</div></div>
  }

  if (error) {
    return <div className="metrics-page"><div className="error">{error}</div></div>
  }

  return (
    <div className="metrics-page">
      <div className="header">
        <div className="header-top">
          <h1 className="page-title">Metric</h1>
        </div>
        <p className="page-description">
          시스템에서 수집되는 모든 지표를 관리하고 모니터링할 수 있습니다.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">전체 지표</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-change">전체 등록된 지표</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">활성 지표</div>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-change">현재 수집 중</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">비활성 지표</div>
          <div className="stat-value">{stats.inactive}</div>
          <div className="stat-change">수집 중단됨</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">주의 지표</div>
          <div className="stat-value">{stats.warning}</div>
          <div className="stat-change">모니터링 필요</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-title">지표 목록</div>
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
        </div>
        
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th style={{ width: '200px' }}>지표명</th>
              <th>지표설명</th>
              <th style={{ width: '140px' }}>분류</th>
              <th style={{ width: '120px' }}>수집상태</th>
              <th style={{ width: '100px' }}>버전</th>
            </tr>
          </thead>
          <tbody>
            {currentMetrics.length > 0 ? (
              currentMetrics.map((metric) => (
                <tr key={metric.id}>
                  <td className="metric-number">{String(metric.id).padStart(3, '0')}</td>
                  <td className="metric-name">{metric.name}</td>
                  <td className="metric-description">{metric.description}</td>
                  <td>
                    <span className="badge badge-category">{metric.category}</span>
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
                  <td className="version">{metric.version}</td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1
              // Show first page, last page, current page and pages around current page
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
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
                return <div key={pageNum} className="pagination-ellipsis">...</div>
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
