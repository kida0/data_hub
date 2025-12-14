import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Insights from './pages/Insights'
import Metrics from './pages/Metrics'
import Segments from './pages/Segments'
import Experiments from './pages/Experiments'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/segments" element={<Segments />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

