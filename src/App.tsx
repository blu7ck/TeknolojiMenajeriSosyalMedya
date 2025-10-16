import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import "./components/PackageSelector.css"

// Lazy load components with error handling
const HomePage = lazy(() => import("./pages/HomePage").catch(() => ({
  default: () => <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-600">Ana sayfa yükleniyor...</p>
    </div>
  </div>
})))

const BlogPage = lazy(() => import("./pages/BlogPage").catch(() => ({
  default: () => <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-600">Blog sayfası yükleniyor...</p>
    </div>
  </div>
})))

const AdminPage = lazy(() => import("./pages/AdminPage").catch(() => ({
  default: () => <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-600">Admin paneli yükleniyor...</p>
    </div>
  </div>
})))

const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage").catch(() => ({
  default: () => <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-600">Abonelik iptal sayfası yükleniyor...</p>
    </div>
  </div>
})))

const TestPage = lazy(() => import("./pages/TestPage").catch(() => ({
  default: () => <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-600">Test sayfası yükleniyor...</p>
    </div>
  </div>
})))

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
