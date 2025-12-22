import { useState } from 'react'
import PropTypes from 'prop-types'
import './VersionHistoryModal.css'

function VersionHistoryModal({ isOpen, onClose, metricName }) {
  const [selectedVersion, setSelectedVersion] = useState(null)

  // 샘플 버전 데이터 (추후 API로 대체)
  const versions = [
    {
      id: 5,
      version: 'v1.4',
      created_at: '2024-12-15T14:30:00',
      created_by: '키다',
      change_summary: '결제 완료 이벤트 추가 반영',
      calculation_logic: 'SELECT COUNT(DISTINCT user_id) as payment_users\nFROM payment_complete_events\nWHERE event_date >= CURRENT_DATE - INTERVAL 7 DAY',
      description: '결제 화면 진입 후 실제 결제를 완료한 사용자의 비율',
      is_current: true
    },
    {
      id: 4,
      version: 'v1.3',
      created_at: '2024-12-01T09:15:00',
      created_by: '김데이터',
      change_summary: '결제 화면 진입 이벤트 로직 개선',
      calculation_logic: 'SELECT COUNT(DISTINCT user_id) as payment_screen_users\nFROM payment_screen_events\nWHERE event_date >= CURRENT_DATE - INTERVAL 7 DAY',
      description: '결제 화면에 진입한 사용자 중 결제를 완료한 사용자의 비율',
      is_current: false
    },
    {
      id: 3,
      version: 'v1.2',
      created_at: '2024-11-20T16:45:00',
      created_by: '박분석',
      change_summary: '중복 이벤트 제거 로직 추가',
      calculation_logic: 'SELECT COUNT(user_id) as payment_users\nFROM payment_events\nWHERE event_date >= CURRENT_DATE - INTERVAL 7 DAY',
      description: '결제 화면 진입 후 결제 완료한 사용자 수',
      is_current: false
    },
    {
      id: 2,
      version: 'v1.1',
      created_at: '2024-11-05T11:20:00',
      created_by: '이데이터',
      change_summary: '날짜 필터 조건 수정',
      calculation_logic: 'SELECT COUNT(user_id) FROM payment_events',
      description: '결제를 시도한 사용자 수',
      is_current: false
    },
    {
      id: 1,
      version: 'v1.0',
      created_at: '2024-10-28T10:00:00',
      created_by: '키다',
      change_summary: '초기 버전',
      calculation_logic: 'SELECT COUNT(*) FROM payments',
      description: '결제 수',
      is_current: false
    }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleVersionClick = (version) => {
    setSelectedVersion(selectedVersion?.id === version.id ? null : version)
  }

  const handleCreateNewVersion = () => {
    // TODO: 새 버전 생성 로직
    console.log('새 버전 생성')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content version-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-elegant">
          <div className="modal-header-content">
            <h2 className="modal-title-elegant">버전 관리</h2>
            <p className="modal-subtitle">
              {metricName}의 버전 히스토리를 확인하고 관리할 수 있습니다
            </p>
          </div>
          <button className="modal-close-btn-elegant" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body-version">
          <div className="version-list">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`version-item ${selectedVersion?.id === version.id ? 'selected' : ''} ${version.is_current ? 'current' : ''}`}
                onClick={() => handleVersionClick(version)}
              >
                <div className="version-header">
                  <div className="version-header-left">
                    <div className="version-number-row">
                      <h3 className="version-number">{version.version}</h3>
                      {version.is_current && (
                        <span className="current-badge">현재 버전</span>
                      )}
                    </div>
                    <p className="version-summary">{version.change_summary}</p>
                  </div>
                  <div className="version-meta">
                    <div className="version-author">
                      <div className="author-avatar">{version.created_by.charAt(0)}</div>
                      <span className="author-name">{version.created_by}</span>
                    </div>
                    <p className="version-date">{formatDate(version.created_at)}</p>
                  </div>
                </div>

                {selectedVersion?.id === version.id && (
                  <div className="version-details">
                    <div className="version-detail-section">
                      <div className="detail-section-label">설명</div>
                      <div className="detail-section-content">{version.description}</div>
                    </div>
                    <div className="version-detail-section">
                      <div className="detail-section-label">계산 로직</div>
                      <div className="version-logic-display">
                        <pre className="version-logic-code">{version.calculation_logic}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer-elegant">
          <div className="footer-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>버전을 클릭하여 상세 내용을 확인할 수 있습니다</span>
          </div>
          <button className="btn-elegant btn-primary-elegant" onClick={handleCreateNewVersion}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            새 버전 생성
          </button>
        </div>
      </div>
    </div>
  )
}

VersionHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  metricName: PropTypes.string.isRequired
}

export default VersionHistoryModal
