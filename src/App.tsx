import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import "./components/PackageSelector.css"

// Lazy load components
const HomePage = lazy(() => import("./pages/HomePage"))
const BlogPage = lazy(() => import("./pages/BlogPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"))
const TestPage = lazy(() => import("./pages/TestPage"))

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen custom-cursor custom-cursor custom-cursor" style={{ backgroundColor: "#D3DADD" }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blu4ck" element={<AdminPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
