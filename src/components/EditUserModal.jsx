import { useEffect, useState } from 'react'

// รูปแบบฟอร์มเดียวกับ create แต่ใช้สำหรับแก้ไขข้อมูล
function getEmptyForm() {
  return {
    name: '',
    age: '',
    email: '',
    avatarUrl: '',
  }
}

function EditUserModal({ user, isSubmitting, onClose, onSubmit }) {
  const [formValues, setFormValues] = useState(getEmptyForm())

  useEffect(() => {
    // ทุกครั้งที่ user เปลี่ยน ให้ sync ค่าเข้า form
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormValues(getEmptyForm())
      return
    }

    setFormValues({
      name: user.name,
      age: String(user.age),
      email: user.email,
      avatarUrl: user.avatarUrl,
    })
  }, [user])

  if (!user) {
    // ถ้ายังไม่มี user ที่เลือก จะไม่ render modal
    return null
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setFormValues((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isSuccess = await onSubmit(user.id, formValues)
    if (isSuccess) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Edit User</h2>
        <label htmlFor="edit-name">
          Name
          <input
            id="edit-name"
            name="name"
            value={formValues.name}
            onChange={onChange}
            required
          />
        </label>
        <label htmlFor="edit-age">
          Age
          <input
            id="edit-age"
            name="age"
            type="number"
            min="0"
            value={formValues.age}
            onChange={onChange}
            required
          />
        </label>
        <label htmlFor="edit-email">
          Email
          <input
            id="edit-email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={onChange}
            required
          />
        </label>
        <label htmlFor="edit-avatarUrl">
          Avatar URL
          <input
            id="edit-avatarUrl"
            name="avatarUrl"
            type="url"
            value={formValues.avatarUrl}
            onChange={onChange}
            required
          />
        </label>
        <div className="modal-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditUserModal
