import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Card from "./components/top/card"
import TopImage from "./components/top/TopImage"

function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-1">
          <TopImage />
          <Card />
        </main>
      <Footer />
    </div>
  )
}

export default App
