import { useEffect, useState } from 'react'

/**
 * useDebouncedValue:
 * คืนค่า value แบบ "หน่วงเวลา"
 * ตัวอย่าง: พิมพ์ search ทุกตัวอักษร แต่จะปล่อยค่าใหม่หลังหยุดพิมพ์ครบ delayMs
 * ประโยชน์: ลดจำนวน request/API call ที่ไม่จำเป็น
 */
export default function useDebouncedValue(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [value, delayMs])

  return debouncedValue
}
