import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Loader from "./components/Loader"
import "./components/PackageSelector.css"

// Lazy load components with error handling
const HomePage = lazy(() => import("./pages/HomePage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
})))

const BlogPage = lazy(() => import("./pages/BlogPage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
})))

const BlogPostPage = lazy(() => import("./pages/BlogPostPage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
})))

const AdminPage = lazy(() => import("./pages/AdminPage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
})))

const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
})))

const TestPage = lazy(() => import("./pages/TestPage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
})))

const MorePage = lazy(() => import("./pages/MorePage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader />
    </div>
  )
})))

const GalleryPage = lazy(() => import("./pages/GalleryPage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Loader />
    </div>
  )
})))

const MarketingGlossaryPage = lazy(() => import("./pages/MarketingGlossaryPage").catch(() => ({
  default: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Loader />
    </div>
  )
})))

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
      <Loader />
    </div>
  )
}

function App() {
  const isDev = import.meta.env.MODE === 'development'

  return (
    <div className="min-h-screen custom-cursor custom-cursor custom-cursor" style={{ backgroundColor: "#D3DADD" }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blu4ck" element={<AdminPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/marketingGlossary" element={<MarketingGlossaryPage />} />
          {isDev && <Route path="/test" element={<TestPage />} />}
        </Routes>
        <SpeedInsights />
      </Suspense>
    </div>
  )
}

export default App
