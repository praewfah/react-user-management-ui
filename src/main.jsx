/**
 * main.jsx คือ "entry file" ของแอป React ฝั่ง browser
 *
 * .jsx คือไฟล์ JavaScript ที่เขียน HTML-like syntax (JSX) ได้
 * เช่น <UserManagementPage /> ซึ่งท้ายที่สุดจะถูก build เป็น JavaScript ปกติ
 *
 * สรุปหน้าที่ไฟล์นี้:
 * 1) import component หลักของแอป
 * 2) หา DOM node ปลายทาง (#root)
 * 3) สั่ง React render UI ลงใน node นั้น
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserManagementPage from './pages/UserManagementPage.jsx'

createRoot(document.getElementById('root')).render(
  /**
   * StrictMode:
   * - ใช้เฉพาะตอนพัฒนา (development) เพื่อช่วยจับ pattern ที่เสี่ยง bug
   * - ไม่มี UI เพิ่ม และไม่มีผลกับ production build โดยตรง
   * - React อาจเรียก lifecycle/hook บางช่วงซ้ำเพื่อช่วยหา side effect ที่ไม่ปลอดภัย
   *
   * ใช้เมื่อ:
   * - ต้องการ code quality และหา bug ได้เร็วขึ้น
   */
  <StrictMode>
    <UserManagementPage />
  </StrictMode>,
)
