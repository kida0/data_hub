// Chart Container Component - Wrapper for Chart.js charts
import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2'
import {
  getLineChartOptions,
  getBarChartOptions,
  getDoughnutChartOptions,
} from '../utils/chartConfig'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function ChartContainer({
  type = 'line',
  data,
  options = {},
  height = 300,
  title,
  actions,
  className = '',
}) {
  const chartRef = useRef(null)

  // Get default options based on chart type
  const getDefaultOptions = () => {
    switch (type) {
      case 'line':
        return getLineChartOptions(options)
      case 'bar':
        return getBarChartOptions(options)
      case 'doughnut':
      case 'pie':
        return getDoughnutChartOptions(options)
      default:
        return options
    }
  }

  const chartOptions = getDefaultOptions()

  // Render appropriate chart type
  const renderChart = () => {
    const chartProps = {
      ref: chartRef,
      data,
      options: chartOptions,
      height,
    }

    switch (type) {
      case 'line':
        return <Line {...chartProps} />
      case 'bar':
        return <Bar {...chartProps} />
      case 'doughnut':
        return <Doughnut {...chartProps} />
      case 'pie':
        return <Pie {...chartProps} />
      default:
        return <Line {...chartProps} />
    }
  }

  return (
    <div className={`chart-container ${className}`.trim()}>
      {(title || actions) && (
        <div className="chart-header">
          {title && <h3 className="chart-title">{title}</h3>}
          {actions && <div className="chart-actions">{actions}</div>}
        </div>
      )}
      <div className="canvas-wrapper" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  )
}

ChartContainer.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'doughnut', 'pie']),
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  height: PropTypes.number,
  title: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
}

export default ChartContainer
