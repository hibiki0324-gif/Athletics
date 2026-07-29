import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"

function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-1">
          {/*ページの中身*/}
        </main>
      <Footer />
    </div>
  )
}

export default App
