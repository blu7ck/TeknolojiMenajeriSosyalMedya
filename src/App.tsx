import { Routes, Route } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { BlogPage } from "./pages/BlogPage"
import { AdminPage } from "./pages/AdminPage"
import { UnsubscribePage } from "./pages/UnsubscribePage"
import "./components/PackageSelector.css"

function App() {
  return (
    <div className="min-h-screen custom-cursor custom-cursor custom-cursor" style={{ backgroundColor: "#D3DADD" }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blu4ck" element={<AdminPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
      </Routes>
    </div>
  )
}

export default App
