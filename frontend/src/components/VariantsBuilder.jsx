import { useState, useEffect } from 'react'
import './VariantsBuilder.css'

function VariantsBuilder({ variants, onChange }) {
  const [localVariants, setLocalVariants] = useState(variants)

  useEffect(() => {
    setLocalVariants(variants)
  }, [variants])

  const handleVariantChange = (index, field, value) => {
    const updated = [...localVariants]
    updated[index][field] = value

    // traffic_allocation은 숫자로 변환
    if (field === 'traffic_allocation') {
      updated[index][field] = value === '' ? 0 : Number(value)
    }

    setLocalVariants(updated)
    onChange(updated)
  }

  const handleAddVariant = () => {
    const newVariantLetter = String.fromCharCode(65 + localVariants.length - 1) // A, B, C...
    const newVariant = {
      name: `Variant ${newVariantLetter}`,
      description: '',
      traffic_allocation: 0
    }
    const updated = [...localVariants, newVariant]
    setLocalVariants(updated)
    onChange(updated)
  }

  const handleRemoveVariant = (index) => {
    if (localVariants[index].name === 'Control') {
      return // Control은 삭제 불가
    }
    const updated = localVariants.filter((_, i) => i !== index)
    setLocalVariants(updated)
    onChange(updated)
  }

  // 트래픽 할당 합계 계산
  const totalTraffic = localVariants.reduce((sum, v) => sum + (Number(v.traffic_allocation) || 0), 0)
  const isValidTraffic = totalTraffic === 100

  return (
    <div className="variants-builder">
      {localVariants.map((variant, index) => (
        <div key={index} className="variant-card">
          <div className="variant-header">
            <div className="variant-title">
              {variant.name === 'Control' ? (
                <span className="control-badge">대조군 (Control)</span>
              ) : (
                <span className="variant-badge">실험군 (Variant {String.fromCharCode(65 + index - 1)})</span>
              )}
            </div>
            {variant.name !== 'Control' && (
              <button
                type="button"
                className="remove-variant-btn"
                onClick={() => handleRemoveVariant(index)}
                title="실험군 제거"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <div className="variant-fields-compact">
            <div className="form-group-inline">
              <label className="form-label-inline">그룹명 <span className="required">*</span></label>
              <input
                type="text"
                className="form-input-compact"
                value={variant.name}
                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                placeholder="예: Control, Variant A"
              />
            </div>

            <div className="form-group-inline">
              <label className="form-label-inline">할당량 (%) <span className="required">*</span></label>
              <input
                type="number"
                className="form-input-compact allocation-input"
                min="0"
                max="100"
                value={variant.traffic_allocation}
                onChange={(e) => handleVariantChange(index, 'traffic_allocation', e.target.value)}
                placeholder="0-100"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-add-variant"
        onClick={handleAddVariant}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        실험군 추가
      </button>

      {/* 할당량 합계 표시 및 검증 */}
      <div className="traffic-summary">
        <div className="traffic-label">
          <span>총 할당량</span>
          <span className={`traffic-total ${isValidTraffic ? 'valid' : 'invalid'}`}>
            {totalTraffic}%
            {isValidTraffic ? (
              <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg className="warning-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
          </span>
        </div>

        {/* 진행 바 */}
        <div className="traffic-progress-bar">
          {localVariants.map((variant, index) => (
            <div
              key={index}
              className="traffic-segment"
              style={{
                width: `${variant.traffic_allocation}%`,
                backgroundColor: index === 0 ? '#8b95a1' : `hsl(${210 + index * 30}, 70%, 60%)`
              }}
              title={`${variant.name}: ${variant.traffic_allocation}%`}
            />
          ))}
        </div>

        {!isValidTraffic && (
          <div className="traffic-warning">
            할당량의 합계가 100%가 되어야 합니다 (현재: {totalTraffic}%)
          </div>
        )}
      </div>
    </div>
  )
}

export default VariantsBuilder
