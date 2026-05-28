import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AutoMarker from './pages/AutoMarker.jsx'
import NotesInterpreter from './pages/NotesInterpreter.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/automarker" element={<AutoMarker />} />
        <Route path="/notes-interpreter" element={<NotesInterpreter />} />
      </Routes>
    </>
  )
}
