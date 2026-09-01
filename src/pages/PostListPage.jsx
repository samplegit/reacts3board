import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../api/posts'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'

export default function PostListPage() {
  const [result, setResult] = useState(null)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [appliedKeyword, setAppliedKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    fetchPosts({ page, size: 10, keyword: appliedKeyword })
      .then((data) => alive && setResult(data))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [page, appliedKeyword])

  function search(event) {
    event.preventDefault()
    setPage(0)
    setAppliedKeyword(keyword.trim())
  }

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">공개게시판</p>
          <h1>게시판</h1>
          
        </div>
        <Link className="button primary" to="/write">새 글 작성</Link>
      </section>

      <section className="card">
        <form className="search-form" onSubmit={search}>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="제목·내용·작성자 검색" />
          <button type="submit">검색</button>
        </form>

        <ErrorBox message={error} />
        {loading && <Loading />}

        {!loading && result && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회</th>
                    <th>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {result.content.length === 0 && (
                    <tr><td colSpan="5" className="empty-cell">게시글이 없습니다.</td></tr>
                  )}
                  {result.content.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td className="title-cell">
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                        {post.hasImages && <span className="badge">사진</span>}
                        {post.commentCount > 0 && <span className="comment-count">[{post.commentCount}]</span>}
                      </td>
                      <td>{post.author}</td>
                      <td>{post.viewCount}</td>
                      <td>{formatDate(post.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button disabled={result.first} onClick={() => setPage((p) => Math.max(0, p - 1))}>이전</button>
              <span>{result.totalPages === 0 ? 0 : result.page + 1} / {result.totalPages}</span>
              <button disabled={result.last || result.totalPages === 0} onClick={() => setPage((p) => p + 1)}>다음</button>
            </div>
          </>
        )}
      </section>
    </>
  )
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('ko-KR') : ''
}
