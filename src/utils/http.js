export class ApiError extends Error {
  /**
   * Error object มาตรฐานของแอปสำหรับงาน API:
   * - message: ข้อความพร้อมแสดงผู้ใช้
   * - status: HTTP status code
   * - payload: response body เดิมจาก backend
   */
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function getApiErrorMessage(payload, fallbackMessage) {
  // รองรับหลาย shape ของ error body เพื่อกัน backend เปลี่ยนรูปแบบ
  if (typeof payload === 'string' && payload.trim() !== '') {
    return payload
  }

  if (payload && typeof payload === 'object') {
    if (typeof payload.message === 'string' && payload.message.trim() !== '') {
      return payload.message
    }

    if (
      payload.detail &&
      typeof payload.detail === 'object' &&
      typeof payload.detail.message === 'string' &&
      payload.detail.message.trim() !== ''
    ) {
      return payload.detail.message
    }

    if (typeof payload.detail === 'string' && payload.detail.trim() !== '') {
      return payload.detail
    }
  }

  return fallbackMessage
}

export async function parseApiPayload(response) {
  // parse เป็น JSON เมื่อ content-type ถูกต้อง, ไม่งั้นอ่านข้อความดิบ
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  try {
    const text = await response.text()
    return text.trim() === '' ? null : text
  } catch {
    return null
  }
}

export function getHttpErrorMessage(response, payload, fallbackMessage) {
  // map ข้อความบาง status เพื่อให้ user-friendly มากขึ้น
  if (response.status === 502) {
    return 'Bad Gateway: cannot reach API server right now.'
  }

  return getApiErrorMessage(payload, fallbackMessage)
}

export function getErrorMessage(error, fallbackMessage) {
  // helper สำหรับฝั่ง UI เพื่อดึงข้อความจาก Error object อย่างปลอดภัย
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
