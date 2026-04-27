import { ApiError, getHttpErrorMessage, parseApiPayload } from '../utils/http'
import {
  mockCreateUser,
  mockDeleteUser,
  mockListUsers,
  mockRestoreUserByEmail,
  mockUpdateUser,
} from '../mocks/userMockApi'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const SHOULD_USE_MOCK_ONLY = (import.meta.env.VITE_MOCK_MODE ?? '0') === '1'

/**
 * service layer:
 * - รวมจุดเรียก API ไว้ที่เดียว
 * - normalize payload ให้ component/hook ใช้งานง่าย
 * - สลับไป mock implementation ได้จาก config
 */

function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') {
    return user
  }

  return {
    ...user,
    avatarUrl: user.avatarUrl ?? user.avatar_url ?? '',
  }
}

function normalizeListPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  return {
    ...payload,
    items: Array.isArray(payload.items)
      ? payload.items.map((item) => normalizeUser(item))
      : [],
  }
}

async function request(path, options = {}, fallbackMessage = 'Request failed.') {
  // parse response แบบปลอดภัย (JSON/text) และโยน ApiError เมื่อ non-2xx
  const response = await fetch(buildApiUrl(path), options)
  const payload = await parseApiPayload(response)

  if (!response.ok) {
    throw new ApiError(
      getHttpErrorMessage(response, payload, fallbackMessage),
      response.status,
      payload,
    )
  }

  return payload
}

export async function listUsers({ query, start, limit }) {
  const params = new URLSearchParams({
    start: String(start),
    limit: String(limit),
  })

  if (query.trim() !== '') {
    params.set('q', query.trim())
  }

  if (SHOULD_USE_MOCK_ONLY) {
    // mock mode: ไม่ยิง API จริง
    return mockListUsers({ query, start, limit })
  }

  const payload = await request(
    `/api/user?${params.toString()}`,
    {},
    'Cannot load users from API.',
  )
  return normalizeListPayload(payload)
}

export async function createUser(payload) {
  if (SHOULD_USE_MOCK_ONLY) {
    return mockCreateUser(payload)
  }

  const created = await request(
    '/api/user',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Create user failed.',
  )
  return normalizeUser(created)
}

export async function restoreUserByEmail(email) {
  if (SHOULD_USE_MOCK_ONLY) {
    return mockRestoreUserByEmail(email)
  }

  const restored = await request(
    `/api/user/restore?email=${encodeURIComponent(email.trim().toLowerCase())}`,
    { method: 'POST' },
    'Restore user failed.',
  )
  return normalizeUser(restored)
}

export async function updateUser(userId, payload) {
  if (SHOULD_USE_MOCK_ONLY) {
    return mockUpdateUser(userId, payload)
  }

  const updated = await request(
    `/api/user/${userId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Update user failed.',
  )
  return normalizeUser(updated)
}

export async function deleteUser(userId) {
  if (SHOULD_USE_MOCK_ONLY) {
    return mockDeleteUser(userId)
  }

  return request(`/api/user/${userId}`, { method: 'DELETE' }, 'Delete user failed.')
}
