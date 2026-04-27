import { useMemo, useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * คืนค่าเริ่มต้นของฟอร์ม
 * แยกเป็นฟังก์ชันเพื่อ reuse ตอน reset และตอน init state
 */
function getInitialForm() {
  return {
    name: '',
    age: '',
    email: '',
    avatarUrl: '',
  }
}

function validate(values) {
  // validate ฝั่ง client เพื่อให้ feedback ทันที ไม่ต้องรอ server ตอบกลับทุกครั้ง
  const errors = {}

  if (values.name.trim() === '') {
    errors.name = 'Name is required.'
  }

  if (values.age.trim() === '') {
    errors.age = 'Age is required.'
  } else {
    const ageNumber = Number(values.age)
    if (!Number.isInteger(ageNumber) || ageNumber < 0) {
      errors.age = 'Age must be a non-negative integer.'
    }
  }

  if (values.email.trim() === '') {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Email format is invalid.'
  }

  if (values.avatarUrl.trim() === '') {
    errors.avatarUrl = 'Avatar URL is required.'
  } else {
    try {
      new URL(values.avatarUrl.trim())
    } catch {
      errors.avatarUrl = 'Avatar URL must be a valid URL.'
    }
  }

  return errors
}

function CreateUserModal({ isOpen, isSubmitting, onClose, onSubmit }) {
  const [formValues, setFormValues] = useState(getInitialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})

  const visibleErrors = useMemo(() => {
    // แสดง error เฉพาะ field ที่เคยถูกแตะ (touched) เพื่อไม่รบกวนผู้ใช้เกินไป
    return Object.fromEntries(
      Object.entries(fieldErrors).filter(([key]) => touchedFields[key]),
    )
  }, [fieldErrors, touchedFields])

  if (!isOpen) {
    return null
  }

  const onChange = (event) => {
    const { name, value } = event.target
    const nextValues = { ...formValues, [name]: value }
    setFormValues(nextValues)
    setFieldErrors(validate(nextValues))
  }

  const onBlur = (event) => {
    const { name } = event.target
    setTouchedFields((previous) => ({ ...previous, [name]: true }))
  }

  const resetForm = () => {
    setFormValues(getInitialForm())
    setFieldErrors({})
    setTouchedFields({})
  }

  const onCloseModal = () => {
    if (isSubmitting) {
      return
    }

    resetForm()
    onClose()
  }

  const onSubmitForm = async (event) => {
    event.preventDefault()
    const errors = validate(formValues)
    setFieldErrors(errors)
    setTouchedFields({
      name: true,
      age: true,
      email: true,
      avatarUrl: true,
    })

    if (Object.keys(errors).length > 0) {
      return
    }

    const isSuccess = await onSubmit(formValues)
    if (isSuccess) {
      resetForm()
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={onSubmitForm}>
        <h2>Create User</h2>

        <label htmlFor="create-name">
          Name
          <input
            id="create-name"
            name="name"
            value={formValues.name}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={visibleErrors.name ? 'true' : 'false'}
          />
          {visibleErrors.name ? (
            <span className="field-error">{visibleErrors.name}</span>
          ) : null}
        </label>

        <label htmlFor="create-age">
          Age
          <input
            id="create-age"
            name="age"
            type="number"
            min="0"
            value={formValues.age}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={visibleErrors.age ? 'true' : 'false'}
          />
          {visibleErrors.age ? (
            <span className="field-error">{visibleErrors.age}</span>
          ) : null}
        </label>

        <label htmlFor="create-email">
          Email
          <input
            id="create-email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={visibleErrors.email ? 'true' : 'false'}
          />
          {visibleErrors.email ? (
            <span className="field-error">{visibleErrors.email}</span>
          ) : null}
        </label>

        <label htmlFor="create-avatarUrl">
          Avatar URL
          <input
            id="create-avatarUrl"
            name="avatarUrl"
            type="url"
            value={formValues.avatarUrl}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={visibleErrors.avatarUrl ? 'true' : 'false'}
          />
          {visibleErrors.avatarUrl ? (
            <span className="field-error">{visibleErrors.avatarUrl}</span>
          ) : null}
        </label>

        <div className="modal-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={onCloseModal}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateUserModal
