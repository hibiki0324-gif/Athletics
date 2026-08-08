import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout/Layout'
import Top from './pages/public/Top'
import Player from './pages/public/Player'
import Result from "./pages/public/Result";
import Login from "./pages/public/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route element={<Layout />}>
          <Route path="/" element={<Top />} />
          <Route path="/players" element={<Player />} />
          <Route path="/results" element={<Result />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
