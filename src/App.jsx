import { Link, Route, Routes } from 'react-router-dom'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostWritePage from './pages/PostWritePage'
import PostEditPage from './pages/PostEditPage'

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">OO Compony</Link>
        <nav>
          <Link to="/">게시글</Link>
          <Link className="primary-link" to="/write">글쓰기</Link>
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/write" element={<PostWritePage />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
          <Route path="*" element={<div className="card">페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </main>
    </div>
  )
}
