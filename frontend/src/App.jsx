import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Insights from './pages/Insights'
import InsightDetail from './pages/InsightDetail'
import InsightDetailExample from './pages/InsightDetailExample'
import CreateInsight from './pages/CreateInsight'
import Metrics from './pages/Metrics'
import MetricDetail from './pages/MetricDetail'
import MetricCreate from './pages/MetricCreate'
import MetricEdit from './pages/MetricEdit'
import Segments from './pages/Segments'
import SegmentDetail from './pages/SegmentDetail'
import SegmentCreate from './pages/SegmentCreate'
import SegmentEdit from './pages/SegmentEdit'
import Experiments from './pages/Experiments'
import ExperimentCreate from './pages/ExperimentCreate'
import ExperimentDetail from './pages/ExperimentDetail'
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
          <Route path="/segments/new" element={<SegmentCreate />} />
          <Route path="/segments/:id/edit" element={<SegmentEdit />} />
          <Route path="/segments/:id" element={<SegmentDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/new" element={<CreateInsight />} />
          <Route path="/insights/example/onboarding-improvement" element={<InsightDetailExample />} />
          <Route path="/insights/:category/:id" element={<InsightDetail />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/experiments/new" element={<ExperimentCreate />} />
          <Route path="/experiments/:id/edit" element={<ExperimentCreate />} />
          <Route path="/experiments/:id" element={<ExperimentDetail />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

