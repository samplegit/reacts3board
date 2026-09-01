import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'
import PostForm from '../components/PostForm'

export default function PostWritePage() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  async function submit(payload, images) {
    setBusy(true)
    try {
      const created = await createPost(
        { title: payload.title, author: payload.author, content: payload.content },
        images,
      )
      navigate(`/posts/${created.id}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-title"><h1>새 글 작성</h1></div>
      <PostForm submitLabel="등록" onSubmit={submit} busy={busy} />
    </>
  )
}
