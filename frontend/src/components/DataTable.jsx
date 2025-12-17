// DataTable Component - Basic reusable table with search, filter, and pagination
// Can be extended by parent components for specific needs
import { useState } from 'react'
import PropTypes from 'prop-types'

function DataTable({
  columns,
  data,
  searchable = false,
  searchPlaceholder = '검색...',
  onSearch,
  filters,
  pagination = false,
  pageSize = 10,
  onRowClick,
  rowClassName,
  className = '',
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)
    if (onSearch) {
      onSearch(value)
    }
  }

  // Pagination logic
  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className={`data-table-wrapper ${className}`.trim()}>
      {/* Search and Filter Bar */}
      {(searchable || filters) && (
        <div className="search-filter-bar">
          {searchable && (
            <input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
            />
          )}
          {filters && <div className="filters">{filters}</div>}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} style={column.headerStyle}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={rowClassName ? rowClassName(row) : ''}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={column.cellStyle}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func,
      headerStyle: PropTypes.object,
      cellStyle: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  onSearch: PropTypes.func,
  filters: PropTypes.node,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.func,
  className: PropTypes.string,
}

export default DataTable
