// จำนวนรายการต่อหน้าในตาราง users
export const PAGE_SIZE = 5
// หน่วงเวลา search เพื่อลดจำนวน request
export const SEARCH_DEBOUNCE_MS = 400

// ไอคอน avatar สำรอง (inline SVG) ใช้เมื่อไม่มีรูปหรือรูปโหลดไม่สำเร็จ
export const DEFAULT_AVATAR =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="32" fill="%23e5e7eb"/%3E%3Ccircle cx="32" cy="24" r="12" fill="%239ca3af"/%3E%3Cpath d="M12 54c3.5-10 12-16 20-16s16.5 6 20 16" fill="%239ca3af"/%3E%3C/svg%3E'
