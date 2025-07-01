
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './components/Providers'
import { Home } from './pages/Home'
import ContentDetail from './pages/ContentDetail'

function App() {

  return (
    <>
      <Providers>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:metadata_cid" element={<ContentDetail />} />
          </Routes>
        </Router>
      </Providers>
    </>
  )
}

export default App
