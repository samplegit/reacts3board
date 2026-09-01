import api from './client'

export async function fetchPosts({ page = 0, size = 10, keyword = '' } = {}) {
  const { data } = await api.get('/posts', { params: { page, size, keyword } })
  return data
}

export async function fetchPost(id, { forEdit = false } = {}) {
  const suffix = forEdit ? '/edit' : ''
  const { data } = await api.get(`/posts/${id}${suffix}`)
  return data
}

function createPostFormData(payload, images = []) {
  const formData = new FormData()
  formData.append('post', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  images.forEach((file) => formData.append('images', file))
  return formData
}

export async function createPost(payload, images) {
  const { data } = await api.post('/posts', createPostFormData(payload, images))
  return data
}

export async function updatePost(id, payload, images) {
  const { data } = await api.put(`/posts/${id}`, createPostFormData(payload, images))
  return data
}

export async function deletePost(id) {
  await api.delete(`/posts/${id}`)
}
