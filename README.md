# User Management UI

Front-end สำหรับโจทย์ Full-stack ข้อ `4.2` พัฒนาด้วย `React + Vite` โดยเชื่อมกับ `user-management-api`.

## Features

- แสดง user list ในรูปแบบ table (`name`, `age`, `email`, `avatarUrl`)
- Search box ค้นหาจาก `name` หรือ `email` ผ่าน query `q` (debounce 400ms และค้นหาเมื่อพิมพ์ครบอย่างน้อย 3 ตัวอักษร)
- ฟอร์ม `Create User` สำหรับเพิ่มข้อมูล user ใหม่ผ่าน API
- รองรับ `Restore User` ด้วย email เดิมกรณีเคยถูก soft delete
- ปุ่ม `Edit` เพื่อแก้ไขข้อมูล user ผ่าน API
- ปุ่ม `Remove` เพื่อลบ user ผ่าน API
- Pagination (`Previous`, page number, `Next`) โดยใช้ `start` และ `limit` (ตั้งค่า page size ฝั่ง UI = 5)
- รองรับ avatar fallback (default icon) เมื่อ `avatarUrl` ว่างหรือโหลดรูปไม่สำเร็จ
- รองรับ response key ทั้ง `avatarUrl` และ `avatar_url` จาก API
- รองรับเปิด/ปิด `mock data` ผ่าน config
- แสดง success toast หลัง `create/update/delete/restore` สำเร็จ

## Project Structure (Main)

- `src/pages/UserManagementPage.jsx` : หน้าหลักของระบบ user management (Page layer)
- `src/pages/UserManagementPage.css` : styles ของหน้าหลัก
- `src/components/` : UI components (table, toolbar, modal, pagination)
- `src/hooks/useUsers.js` : state + business logic ของหน้า users
- `src/services/userApi.js` : layer สำหรับเรียก backend API
- `src/utils/` : utility functions (http parsing/error, avatar fallback)
- `src/constants/user.js` : constants ที่ใช้ร่วมกัน

## API Contract Used

- `GET /api/user?q=&start=0&limit=5` (UI ปัจจุบันเรียกที่ limit = 5)
- `POST /api/user`
- `POST /api/user/restore?email={email}`
- `PUT /api/user/{userId}`
- `DELETE /api/user/{userId}`

### Restore Behavior

- ถ้า `Create User` ได้ `409` และ response body มี `detail.is_deleted = true`
- ระบบจะแสดง `alert/confirm popup` ถามผู้ใช้ว่าจะ `Restore` user เดิมหรือไม่
- เมื่อยืนยัน ระบบจะเรียก `POST /api/user/restore?email={email}` และ refresh ตารางทันทีเมื่อสำเร็จ
- ถ้าไม่ใช่เคส restore จะแสดง error ตามข้อความจาก response body (`message`, `detail.message`, `detail`)

โหมดพัฒนา (`npm run dev`) จะเรียก API ผ่าน Vite proxy โดย default ไปที่ `http://localhost:8000`

## Run Project

1. ติดตั้ง dependencies

```bash
npm install
```

2. ตั้งค่า environment (ถ้าต้องการเปลี่ยน API host)

```bash
cp .env.example .env
```

- ถ้า backend รันพอร์ตอื่น ให้แก้ `VITE_PROXY_TARGET` ใน `.env`

3. รัน development server

```bash
npm run dev
```

4. build production

```bash
npm run build
```

## Environment Variables

- `VITE_PROXY_TARGET` : target backend สำหรับ Vite dev proxy (แนะนำใช้ตอน local)
- `VITE_API_BASE_URL` : base URL สำหรับ direct call (เหมาะกับ production build)
- `VITE_MOCK_MODE` : โหมดข้อมูล (`0`, `1`)
  - `0` = ใช้ API จริงอย่างเดียว
  - `1` = ใช้ mock data ทั้งหมด (ไม่เรียก API จริง)

## UI Evidence (Screenshots)

เก็บรูปไว้ใน `docs/screenshot/` และบันทึกผล Expected/Actual ให้ครบ

| No. | Scenario | Evidence | Input / Expected / Actual |
|---|---|---|---|
| 1 | Main page + table + pagination | `docs/screenshot/01-user-pagination.png` | เปิดหน้าแรก -> Expected: เห็นตาราง + pagination, Actual: ตรงตามภาพ |
| 2 | Search by keyword | `docs/screenshot/02-search-keyword.png` | ใส่ keyword ในช่องค้นหา -> Expected: ข้อมูลถูก filter ตาม keyword, Actual: ... |
| 3 | Open create user form | `docs/screenshot/03-create-user-form.png` | กดปุ่ม Create User -> Expected: แสดง popup ฟอร์ม create, Actual: ... |
| 4 | Fill create user form | `docs/screenshot/04-create-user-form.png` | กรอกข้อมูลในฟอร์ม create -> Expected: กรอกข้อมูลได้ครบทุก field, Actual: ... |
| 5 | Create user success | `docs/screenshot/05-create-user-success.png` | submit ข้อมูลถูกต้อง -> Expected: สร้างสำเร็จ + success toast, Actual: ... |
| 6 | Open edit user form | `docs/screenshot/06-edit-user-form.png` | กดปุ่ม Edit ที่แถวข้อมูล -> Expected: แสดง popup ฟอร์ม edit พร้อมข้อมูลเดิม, Actual: ... |
| 7 | Update user success | `docs/screenshot/07-update-user-success.png` | บันทึกการแก้ไข -> Expected: อัปเดตสำเร็จ + success toast, Actual: ... |
| 8 | Confirm remove user | `docs/screenshot/08-confirm-remove-user.png` | กด Remove -> Expected: มี confirm popup ก่อนลบ, Actual: ... |
| 9 | Remove user success | `docs/screenshot/09-remove-user-success.png` | ยืนยันการลบ -> Expected: ลบสำเร็จ + success toast, Actual: ... |
| 10 | Create duplicate email | `docs/screenshot/10-create-duplicate-email.png` | สร้าง user ด้วย email ซ้ำ -> Expected: ระบบแจ้ง duplicate/เสนอ restore ตามเงื่อนไข, Actual: ... |
| 11 | Duplicate email unsuccessful | `docs/screenshot/11-create-duplicate-email-unsuccesfull.png` | ไม่ restore หรือเคส duplicate ปกติ -> Expected: แสดง error popup, Actual: ... |
| 12 | Field validation error | `docs/screenshot/12-validate-field-error.png` | กรอกข้อมูลไม่ถูกต้องใน form -> Expected: แสดง error ราย field, Actual: ... |
| 13 | Lint command result | `docs/screenshot/13-npm-run-lint.png` | รัน `npm run lint` -> Expected: command สำเร็จไม่มี error, Actual: ... |
| 14 | Build command result | `docs/screenshot/14-npm-run-build.png` | รัน `npm run build` -> Expected: build ผ่านสำเร็จ, Actual: ... |
| 15 | Responsive layout | `docs/screenshot/15-ui-responsive-layout.png` | เปิดบนหน้าจอเล็ก -> Expected: layout และ font-size responsive, Actual: ... |

## Demo & Verification

- Video demo flow: `create -> duplicate email -> restore -> search -> edit -> delete -> pagination`
- แนบหลักฐานการรันคำสั่ง:
  - `npm run lint`
  - `npm run build`
