import { ApiError } from '../utils/http'

/**
 * In-memory mock API
 * - ใช้แทน backend จริงเมื่อเปิด VITE_MOCK_MODE=1
 * - เก็บข้อมูลใน memory ของ browser session (refresh หน้าแล้ว reset)
 */

const mockUsers = [
  {
    id: 1,
    name: 'Aumaporn',
    age: 29,
    email: 'aumaporn@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 2,
    name: 'Praew',
    age: 30,
    email: 'praew@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 3,
    name: 'Alice',
    age: 29,
    email: 'alice@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 4,
    name: 'Bob',
    age: 31,
    email: 'bob@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 5,
    name: 'Charlie',
    age: 27,
    email: 'charlie@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 6,
    name: 'Diana',
    age: 33,
    email: 'diana@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 7,
    name: 'Ethan',
    age: 26,
    email: 'ethan@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 8,
    name: 'Fiona',
    age: 28,
    email: 'fiona@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 9,
    name: 'George',
    age: 35,
    email: 'george@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 10,
    name: 'Hannah',
    age: 24,
    email: 'hannah@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 11,
    name: 'Ivy',
    age: 30,
    email: 'ivy@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 12,
    name: 'Jack',
    age: 29,
    email: 'jack@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 13,
    name: 'Karen',
    age: 32,
    email: 'karen@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 14,
    name: 'Leo',
    age: 25,
    email: 'leo@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 15,
    name: 'Mia',
    age: 27,
    email: 'mia@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 16,
    name: 'Noah',
    age: 34,
    email: 'noah@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 17,
    name: 'Olivia',
    age: 28,
    email: 'olivia@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 18,
    name: 'Peter',
    age: 36,
    email: 'peter@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 19,
    name: 'Quinn',
    age: 26,
    email: 'quinn@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
  {
    id: 20,
    name: 'Ruby',
    age: 31,
    email: 'ruby@example.com',
    avatarUrl: '',
    isDeleted: false,
  },
]

let nextId = 21

function normalizeEmail(value) {
  // ทำ email เป็น lowercase เพื่อเลี่ยงปัญหาซ้ำต่างตัวพิมพ์
  return value.trim().toLowerCase()
}

function toUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }
}

function findByEmail(email) {
  const normalized = normalizeEmail(email)
  return mockUsers.find((user) => user.email === normalized) ?? null
}

export async function mockListUsers({ query, start, limit }) {
  const keyword = query.trim().toLowerCase()
  let activeUsers = mockUsers.filter((user) => !user.isDeleted)

  if (keyword.length >= 3) {
    // policy ให้ตรง backend จริง: apply search เมื่อ keyword >= 3
    activeUsers = activeUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword),
    )
  }

  const items = activeUsers.slice(start, start + limit).map(toUserResponse)
  const total = activeUsers.length
  const page = Math.floor(start / limit) + 1
  const total_pages = total > 0 ? Math.ceil(total / limit) : 1

  return {
    items,
    total,
    page,
    total_pages,
  }
}

export async function mockCreateUser(payload) {
  const existing = findByEmail(payload.email)
  if (existing) {
    throw new ApiError('Email already exists in the system', 409, {
      detail: {
        message: 'Email already exists in the system',
        is_deleted: existing.isDeleted,
      },
    })
  }

  const created = {
    id: nextId,
    name: payload.name.trim(),
    age: payload.age,
    email: normalizeEmail(payload.email),
    avatarUrl: payload.avatarUrl.trim(),
    isDeleted: false,
  }

  mockUsers.push(created)
  nextId += 1
  return toUserResponse(created)
}

export async function mockRestoreUserByEmail(email) {
  const existing = findByEmail(email)

  if (!existing) {
    throw new ApiError('User not found', 404, {
      detail: { message: 'User not found' },
    })
  }

  if (!existing.isDeleted) {
    throw new ApiError('User is not deleted', 409, {
      detail: { message: 'User is not deleted' },
    })
  }

  existing.isDeleted = false
  return toUserResponse(existing)
}

export async function mockUpdateUser(userId, payload) {
  const target = mockUsers.find((user) => user.id === userId && !user.isDeleted)

  if (!target) {
    throw new ApiError('User not found', 404, {
      detail: { message: 'User not found' },
    })
  }

  const normalizedEmail = normalizeEmail(payload.email)
  const conflict = mockUsers.find(
    (user) => user.id !== userId && user.email === normalizedEmail,
  )

  if (conflict) {
    throw new ApiError('Email already exists in the system', 409, {
      detail: {
        message: 'Email already exists in the system',
        is_deleted: conflict.isDeleted,
      },
    })
  }

  target.name = payload.name.trim()
  target.age = payload.age
  target.email = normalizedEmail
  target.avatarUrl = payload.avatarUrl.trim()

  return toUserResponse(target)
}

export async function mockDeleteUser(userId) {
  const target = mockUsers.find((user) => user.id === userId)

  if (!target) {
    return { status: 'failed', message: 'User not found' }
  }

  if (target.isDeleted) {
    return { status: 'failed', message: 'User already deleted' }
  }

  target.isDeleted = true
  return { status: 'success' }
}
