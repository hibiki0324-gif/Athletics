import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout/Layout'
import Top from './pages/public/Top'
import Player from './pages/public/Player'
import Result from "./pages/public/Result";
import Login from "./pages/public/Login";
import Stats from "./pages/public/Stats";
import PlayerDetail from "./pages/public/PlayerDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route element={<Layout />}>
          <Route path="/" element={<Top />} />
          <Route path="/players" element={<Player />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/results" element={<Result />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
