import { DEFAULT_AVATAR } from '../constants/user'

// ถ้า avatar ไม่มีค่า จะใช้รูป default แทน
export function getAvatarSrc(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return DEFAULT_AVATAR
  }

  return value
}

export function applyDefaultAvatar(event) {
  // ป้องกัน loop กรณีรูป default เองโหลดผิดพลาด
  event.currentTarget.onerror = null
  event.currentTarget.src = DEFAULT_AVATAR
}
