import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, fetchPost } from '../api/posts'
import CommentSection from '../components/CommentSection'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    fetchPost(id)
      .then((data) => alive && setPost(data))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [id])

  async function removePost() {
    if (!window.confirm('게시글을 삭제할까요? 이미지와 댓글도 함께 삭제됩니다.')) return
    try {
      await deletePost(id)
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <Loading />
  if (error && !post) return <ErrorBox message={error} />
  if (!post) return null

  return (
    <>
      <article className="card post-detail">
        <div className="post-heading">
          <div>
            <h1>{post.title}</h1>
            <p className="post-meta">
              <strong>{post.author}</strong>
              <span>{formatDate(post.createdAt)}</span>
              <span>조회 {post.viewCount}</span>
            </p>
          </div>
          <div className="actions">
            <Link className="button" to={`/posts/${id}/edit`}>수정</Link>
            <button className="danger" type="button" onClick={removePost}>삭제</button>
          </div>
        </div>

        <div className="post-content">{post.content}</div>

        {post.images.length > 0 && (
          <div className="detail-images">
            {post.images.map((image) => (
              <figure key={image.id}>
                <img src={image.url} alt={image.originalFilename} />
                <figcaption>{image.originalFilename}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="actions">
          <Link className="button" to="/">목록</Link>
        </div>
      </article>

      <CommentSection postId={id} />
    </>
  )
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('ko-KR') : ''
}
