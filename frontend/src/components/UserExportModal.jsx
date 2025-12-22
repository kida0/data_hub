import { useState } from 'react'
import PropTypes from 'prop-types'
import './UserExportModal.css'

// 추출 가능한 사용자 특성 목록
const AVAILABLE_FIELDS = [
  { id: 'user_id', name: '사용자 ID', description: '고유한 사용자 식별자' },
  { id: 'name', name: '이름', description: '사용자 이름' },
  { id: 'email', name: '이메일', description: '사용자 이메일 주소' },
  { id: 'phone', name: '전화번호', description: '사용자 전화번호' },
  { id: 'age', name: '나이', description: '사용자 나이' },
  { id: 'gender', name: '성별', description: '사용자 성별 (남/여)' },
  { id: 'region', name: '지역', description: '사용자 거주 지역' },
  { id: 'city', name: '도시', description: '사용자 거주 도시' },
  { id: 'signup_date', name: '회원가입일', description: '서비스 가입 날짜' },
  { id: 'last_visit_date', name: '마지막 방문일', description: '최근 서비스 방문 일자' },
  { id: 'current_month_gmv', name: '현월 GMV', description: '이번 달 총 구매 금액' },
  { id: 'total_purchase_amount', name: '총 구매금액', description: '누적 총 구매 금액' },
  { id: 'total_purchase_count', name: '총 구매횟수', description: '누적 총 구매 횟수' },
  { id: 'average_order_value', name: '평균 구매금액', description: '건당 평균 구매 금액' },
  { id: 'recent_search_keyword', name: '최근 검색어', description: '가장 최근 검색한 키워드' },
  { id: 'favorite_category', name: '선호 카테고리', description: '가장 많이 구매한 카테고리' },
  { id: 'device_type', name: '디바이스', description: '주로 사용하는 디바이스 (iOS/Android/Web)' },
  { id: 'membership_tier', name: '멤버십 등급', description: '현재 멤버십 등급' },
  { id: 'loyalty_points', name: '적립금', description: '보유 적립금' },
  { id: 'marketing_consent', name: '마케팅 수신 동의', description: '마케팅 수신 동의 여부' }
]

function UserExportModal({ isOpen, onClose, segmentName }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFields, setSelectedFields] = useState([])
  const [draggedField, setDraggedField] = useState(null)
  const [dragOverZone, setDragOverZone] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // 선택되지 않은 필드만 왼쪽에 표시
  const selectedFieldIds = selectedFields.map(f => f.id)
  const filteredFields = AVAILABLE_FIELDS.filter(field => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = field.name.toLowerCase().includes(searchLower) ||
      field.description.toLowerCase().includes(searchLower)
    const notSelected = !selectedFieldIds.includes(field.id)
    return matchesSearch && notSelected
  })

  const handleDragStart = (e, field) => {
    setDraggedField(field)
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedField(null)
    setDragOverZone(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverZone(true)
  }

  const handleDragLeave = () => {
    setDragOverZone(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOverZone(false)

    if (!draggedField) return

    // 드래그한 필드가 이미 선택된 필드인지 확인
    if (selectedFieldIds.includes(draggedField.id)) {
      // 이미 선택된 필드라면 순서만 변경 (맨 뒤로 이동)
      setSelectedFields(prev => [
        ...prev.filter(f => f.id !== draggedField.id),
        draggedField
      ])
    } else {
      // 새로운 필드라면 추가
      setSelectedFields(prev => [...prev, draggedField])
    }
    setDraggedField(null)
  }

  const handleRemove = (fieldId) => {
    setSelectedFields(prev => prev.filter(f => f.id !== fieldId))
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('추출할 필드를 선택해주세요.')
      return
    }

    setIsExporting(true)

    try {
      // CSV 생성 (샘플 데이터 - 실제로는 API에서 가져와야 함)
      const headers = selectedFields.map(f => f.name)
      const sampleData = generateSampleData(selectedFields, 100) // 100명의 샘플 사용자

      // CSV 형식으로 변환
      const csvContent = [
        headers.join(','),
        ...sampleData.map(row => row.join(','))
      ].join('\n')

      // BOM 추가 (한글 깨짐 방지)
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

      // 다운로드
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `${segmentName}_사용자추출_${timestamp}.csv`

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 성공 메시지
      alert(`${sampleData.length}명의 사용자 데이터가 추출되었습니다.`)

      // 모달 닫기
      onClose()
    } catch (error) {
      console.error('CSV 추출 실패:', error)
      alert('데이터 추출 중 오류가 발생했습니다.')
    } finally {
      setIsExporting(false)
    }
  }

  // 샘플 데이터 생성 함수
  const generateSampleData = (fields, count) => {
    const data = []
    const regions = ['서울', '경기', '부산', '대구', '인천', '광주', '대전', '울산']
    const cities = ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구']
    const genders = ['남', '여']
    const devices = ['iOS', 'Android', 'Web']
    const tiers = ['브론즈', '실버', '골드', '플래티넘', 'VIP']
    const categories = ['패션', '뷰티', '가전', '식품', '도서', '스포츠']

    for (let i = 0; i < count; i++) {
      const row = fields.map(field => {
        switch (field.id) {
          case 'user_id':
            return `USER${String(i + 1).padStart(6, '0')}`
          case 'name':
            return `사용자${i + 1}`
          case 'email':
            return `user${i + 1}@example.com`
          case 'phone':
            return `010-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
          case 'age':
            return Math.floor(Math.random() * 50) + 20
          case 'gender':
            return genders[Math.floor(Math.random() * genders.length)]
          case 'region':
            return regions[Math.floor(Math.random() * regions.length)]
          case 'city':
            return cities[Math.floor(Math.random() * cities.length)]
          case 'signup_date':
            return new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
          case 'last_visit_date':
            return new Date(2024, 11, Math.floor(Math.random() * 19) + 1).toISOString().split('T')[0]
          case 'current_month_gmv':
            return Math.floor(Math.random() * 500000)
          case 'total_purchase_amount':
            return Math.floor(Math.random() * 5000000)
          case 'total_purchase_count':
            return Math.floor(Math.random() * 50)
          case 'average_order_value':
            return Math.floor(Math.random() * 200000)
          case 'recent_search_keyword':
            return `검색어${Math.floor(Math.random() * 100)}`
          case 'favorite_category':
            return categories[Math.floor(Math.random() * categories.length)]
          case 'device_type':
            return devices[Math.floor(Math.random() * devices.length)]
          case 'membership_tier':
            return tiers[Math.floor(Math.random() * tiers.length)]
          case 'loyalty_points':
            return Math.floor(Math.random() * 50000)
          case 'marketing_consent':
            return Math.random() > 0.5 ? '동의' : '미동의'
          default:
            return '-'
        }
      })
      data.push(row)
    }
    return data
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content export-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-elegant">
          <div className="modal-header-content">
            <h2 className="modal-title-elegant">사용자 데이터 추출</h2>
            <p className="modal-subtitle">
              추출할 사용자 특성을 선택하세요
            </p>
          </div>
          <button className="modal-close-btn-elegant" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body-split-vertical">
          {/* 왼쪽: 모든 필드 */}
          <div className="metrics-panel left-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                사용자 특성
              </h3>
              <span className="panel-count">{filteredFields.length}개</span>
            </div>

            <div className="search-box-elegant">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="특성 이름이나 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-elegant"
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <div className="metrics-scroll-area">
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  className="metric-card draggable"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, field)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="metric-card-header">
                    <div className="metric-card-drag-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="9" x2="19" y2="9"></line>
                        <line x1="5" y1="15" x2="19" y2="15"></line>
                      </svg>
                    </div>
                    <h4 className="metric-card-name">{field.name}</h4>
                  </div>
                  {field.description && (
                    <p className="metric-card-description">{field.description}</p>
                  )}
                </div>
              ))}
              {filteredFields.length === 0 && (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <p>검색 결과가 없습니다</p>
                </div>
              )}
            </div>
          </div>

          {/* 가운데 화살표 */}
          <div className="panel-divider">
            <div className="divider-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          {/* 오른쪽: 선택된 필드 */}
          <div className="selected-fields-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                선택된 특성
              </h3>
              <span className="panel-count">{selectedFields.length}개</span>
            </div>

            <div
              className={`selected-drop-zone ${dragOverZone ? 'drag-over' : ''} ${selectedFields.length === 0 ? 'empty' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFields.length === 0 ? (
                <div className="priority-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p>추출할 특성을 여기로 드래그하세요</p>
                  <span>CSV 파일로 내보낼 컬럼을 선택합니다</span>
                </div>
              ) : (
                <div className="selected-fields-list">
                  {selectedFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="selected-field-card"
                      style={{ animationDelay: `${index * 0.03}s` }}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, field)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="selected-field-number">{index + 1}</div>
                      <div className="selected-field-content">
                        <h5 className="selected-field-name">{field.name}</h5>
                        {field.description && (
                          <p className="selected-field-description">{field.description}</p>
                        )}
                      </div>
                      <button
                        className="remove-field-btn"
                        onClick={() => handleRemove(field.id)}
                        aria-label="필드 제거"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer-elegant">
          <div className="footer-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>드래그하여 추출할 특성을 선택하세요. 선택한 순서대로 CSV 파일에 저장됩니다.</span>
          </div>
          <div className="footer-actions">
            <button className="btn-elegant btn-secondary-elegant" onClick={onClose} disabled={isExporting}>
              취소
            </button>
            <button
              className="btn-elegant btn-primary-elegant"
              onClick={handleExport}
              disabled={isExporting || selectedFields.length === 0}
            >
              {isExporting ? (
                <>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                  추출 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  CSV 추출
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

UserExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  segmentName: PropTypes.string
}

UserExportModal.defaultProps = {
  segmentName: '세그먼트'
}

export default UserExportModal
