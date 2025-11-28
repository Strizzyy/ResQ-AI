import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ReportSubmissionPage from './pages/ReportSubmissionPage'
import TaskListPage from './pages/TaskListPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ReportSubmissionPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
