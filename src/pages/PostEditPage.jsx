import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPost, updatePost } from '../api/posts'
import PostForm from '../components/PostForm'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'

export default function PostEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost(id, { forEdit: true })
      .then(setPost)
      .catch((e) => setError(e.message))
  }, [id])

  async function submit(payload, images) {
    setBusy(true)
    try {
      const updated = await updatePost(id, payload, images)
      navigate(`/posts/${updated.id}`)
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorBox message={error} />
  if (!post) return <Loading />

  return (
    <>
      <div className="page-title"><h1>게시글 수정</h1></div>
      <PostForm initialPost={post} submitLabel="수정 완료" onSubmit={submit} busy={busy} />
    </>
  )
}
