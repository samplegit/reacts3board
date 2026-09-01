import { useEffect, useState } from 'react'
import { createComment, deleteComment, fetchComments, updateComment } from '../api/comments'
import ErrorBox from './ErrorBox'

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editAuthor, setEditAuthor] = useState('')
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadComments()
  }, [postId])

  async function loadComments() {
    try {
      setComments(await fetchComments(postId))
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    if (!author.trim() || !content.trim()) {
      setError('댓글 작성자와 내용을 입력해주세요.')
      return
    }
    try {
      const created = await createComment(postId, { author: author.trim(), content: content.trim() })
      setComments((prev) => [...prev, created])
      setContent('')
    } catch (e) {
      setError(e.message)
    }
  }

  function startEdit(comment) {
    setEditingId(comment.id)
    setEditAuthor(comment.author)
    setEditContent(comment.content)
  }

  async function saveEdit(commentId) {
    setError('')
    try {
      const updated = await updateComment(commentId, {
        author: editAuthor.trim(),
        content: editContent.trim(),
      })
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? updated : comment)))
      setEditingId(null)
    } catch (e) {
      setError(e.message)
    }
  }

  async function remove(commentId) {
    if (!window.confirm('댓글을 삭제할까요?')) return
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section className="card comments-card">
      <h2>댓글 {comments.length}</h2>
      <ErrorBox message={error} />

      <div className="comment-list">
        {comments.length === 0 && <p className="muted">등록된 댓글이 없습니다.</p>}
        {comments.map((comment) => (
          <article className="comment" key={comment.id}>
            {editingId === comment.id ? (
              <div className="comment-edit">
                <input value={editAuthor} maxLength={80} onChange={(e) => setEditAuthor(e.target.value)} />
                <textarea rows={3} value={editContent} maxLength={1000} onChange={(e) => setEditContent(e.target.value)} />
                <div className="actions">
                  <button className="primary small" type="button" onClick={() => saveEdit(comment.id)}>저장</button>
                  <button className="small" type="button" onClick={() => setEditingId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <>
                <div className="comment-meta">
                  <strong>{comment.author}</strong>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p>{comment.content}</p>
                <div className="actions compact">
                  <button type="button" className="link-button" onClick={() => startEdit(comment)}>수정</button>
                  <button type="button" className="link-button danger-text" onClick={() => remove(comment.id)}>삭제</button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleCreate}>
        <input
          value={author}
          maxLength={80}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자"
        />
        <textarea
          rows={3}
          value={content}
          maxLength={1000}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요."
        />
        <button className="primary" type="submit">댓글 등록</button>
      </form>
    </section>
  )
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('ko-KR') : ''
}
