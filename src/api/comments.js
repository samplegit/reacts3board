import api from './client'

export async function fetchComments(postId) {
  const { data } = await api.get(`/posts/${postId}/comments`)
  return data
}

export async function createComment(postId, payload) {
  const { data } = await api.post(`/posts/${postId}/comments`, payload)
  return data
}

export async function updateComment(commentId, payload) {
  const { data } = await api.put(`/comments/${commentId}`, payload)
  return data
}

export async function deleteComment(commentId) {
  await api.delete(`/comments/${commentId}`)
}
