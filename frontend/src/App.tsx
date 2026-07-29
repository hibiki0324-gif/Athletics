import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import RecentResults from "./components/top/RecentResults"
import ScoreBoard from "./components/top/ScoreBoard"
import TopImage from "./components/top/TopImage"

function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-1">
          <TopImage />
          <RecentResults />
          <ScoreBoard />
        </main>
      <Footer />
    </div>
  )
}

export default App
