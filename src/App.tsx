import { Routes, Route, Navigate } from 'react-router-dom'
import TitlePhase from './phases/TitlePhase'
import ConditionPhase from './phases/ConditionPhase'
import EditPhase from './phases/EditPhase'
import Matching1Phase from './phases/Matching1Phase'
import DatePhase from './phases/DatePhase'
import Matching2Phase from './phases/Matching2Phase'
import EndingPhase from './phases/EndingPhase'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TitlePhase />} />
        <Route path="/condition" element={<ConditionPhase />} />
        <Route path="/edit" element={<EditPhase />} />
        <Route path="/matching1" element={<Matching1Phase />} />
        <Route path="/date" element={<DatePhase />} />
        <Route path="/matching2" element={<Matching2Phase />} />
        <Route path="/ending" element={<EndingPhase />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
