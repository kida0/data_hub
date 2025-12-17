import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Insights from './pages/Insights'
import InsightDetail from './pages/InsightDetail'
import Metrics from './pages/Metrics'
import MetricDetail from './pages/MetricDetail'
import MetricCreate from './pages/MetricCreate'
import MetricEdit from './pages/MetricEdit'
import Segments from './pages/Segments'
import SegmentDetail from './pages/SegmentDetail'
import Experiments from './pages/Experiments'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/metrics/new" element={<MetricCreate />} />
          <Route path="/metrics/:id/edit" element={<MetricEdit />} />
          <Route path="/metrics/:id" element={<MetricDetail />} />
          <Route path="/segments" element={<Segments />} />
          <Route path="/segments/:id" element={<SegmentDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:category/:id" element={<InsightDetail />} />
          <Route path="/experiments" element={<Experiments />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

