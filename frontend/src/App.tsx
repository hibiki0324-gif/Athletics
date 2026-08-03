import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout/Layout'
import Top from './pages/public/Top'
import Player from './pages/public/Player'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Top />} />
          <Route path="/players" element={<Player />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
