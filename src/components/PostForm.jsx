import { useEffect, useMemo, useRef, useState } from 'react'
import ErrorBox from './ErrorBox'

const MAX_IMAGES = 5

export default function PostForm({ initialPost, submitLabel, onSubmit, busy }) {
  const [title, setTitle] = useState(initialPost?.title || '')
  const [author, setAuthor] = useState(initialPost?.author || '')
  const [content, setContent] = useState(initialPost?.content || '')
  const [newImages, setNewImages] = useState([])
  const [removeImageIds, setRemoveImageIds] = useState([])
  const [error, setError] = useState('')
  const previewUrlsRef = useRef(new Set())

  const remainingExistingImages = useMemo(
    () => (initialPost?.images || []).filter((image) => !removeImageIds.includes(image.id)),
    [initialPost, removeImageIds],
  )

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current.clear()
    }
  }, [])

  function handleFiles(event) {
    setError('')
    const files = Array.from(event.target.files || [])
    const slots = MAX_IMAGES - remainingExistingImages.length - newImages.length

    if (files.length > slots) {
      setError(`이미지는 게시글당 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`)
      event.target.value = ''
      return
    }

    const invalid = files.find((file) => !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type))
    if (invalid) {
      setError('JPG, PNG, WEBP, GIF 이미지만 선택해주세요.')
      event.target.value = ''
      return
    }

    const oversized = files.find((file) => file.size > 10 * 1024 * 1024)
    if (oversized) {
      setError('이미지 한 장은 10MB 이하여야 합니다.')
      event.target.value = ''
      return
    }

    const additions = files.map((file) => {
      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.add(previewUrl)
      return { file, previewUrl }
    })
    setNewImages((prev) => [...prev, ...additions])
    event.target.value = ''
  }

  function removeNewImage(index) {
    setNewImages((prev) => {
      const url = prev[index].previewUrl
      URL.revokeObjectURL(url)
      previewUrlsRef.current.delete(url)
      return prev.filter((_, i) => i !== index)
    })
  }

  function toggleExistingImage(imageId) {
    setRemoveImageIds((prev) => (
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    ))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim() || !author.trim() || !content.trim()) {
      setError('제목, 작성자, 내용을 모두 입력해주세요.')
      return
    }

    try {
      await onSubmit(
        {
          title: title.trim(),
          author: author.trim(),
          content: content.trim(),
          removeImageIds,
        },
        newImages.map((item) => item.file),
      )
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <ErrorBox message={error} />

      <label>
        작성자
        <input
          value={author}
          maxLength={80}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자 이름"
        />
      </label>

      <label>
        제목
        <input
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시글 제목"
        />
      </label>

      <label>
        내용
        <textarea
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요."
        />
      </label>

      {(initialPost?.images?.length > 0) && (
        <section>
          <h3>기존 이미지</h3>
          <div className="image-grid">
            {initialPost.images.map((image) => {
              const removed = removeImageIds.includes(image.id)
              return (
                <div className={`image-tile ${removed ? 'removed' : ''}`} key={image.id}>
                  <img src={image.url} alt={image.originalFilename} />
                  <button type="button" className="danger ghost" onClick={() => toggleExistingImage(image.id)}>
                    {removed ? '삭제 취소' : '삭제 예정'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <div className="section-heading">
          <h3>새 이미지</h3>
          <span>{remainingExistingImages.length + newImages.length}/{MAX_IMAGES}</span>
        </div>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFiles}
          disabled={remainingExistingImages.length + newImages.length >= MAX_IMAGES}
        />

        {newImages.length > 0 && (
          <div className="image-grid preview-grid">
            {newImages.map((item, index) => (
              <div className="image-tile" key={`${item.file.name}-${item.previewUrl}`}>
                <img src={item.previewUrl} alt={item.file.name} />
                <small>{item.file.name}</small>
                <button type="button" className="danger ghost" onClick={() => removeNewImage(index)}>제거</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="actions right">
        <button className="primary" type="submit" disabled={busy}>
          {busy ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
