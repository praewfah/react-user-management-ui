import { useCallback, useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../constants/user'
import {
  createUser,
  deleteUser,
  listUsers,
  restoreUserByEmail,
  updateUser,
} from '../services/userApi'
import { ApiError, getApiErrorMessage, getErrorMessage } from '../utils/http'
import useDebouncedValue from './useDebouncedValue'

/**
 * buildPageButtons:
 * สร้างรายการเลขหน้าแบบย่อ (... ellipsis) เพื่อไม่ให้ปุ่ม pagination ยาวเกินไป
 */
function buildPageButtons(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) {
    pages.push('...')
  }

  for (let current = start; current <= end; current += 1) {
    pages.push(current)
  }

  if (end < totalPages - 1) {
    pages.push('...')
  }

  pages.push(totalPages)
  return pages
}

export default function useUsers() {
  // Core state ของหน้า users
  const [users, setUsers] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState(null)
  const [successToastMessage, setSuccessToastMessage] = useState('')

  const debouncedSearchKeyword = useDebouncedValue(
    searchInput.trim(),
    SEARCH_DEBOUNCE_MS,
  )
  // นโยบายเดียวกับ backend: ค้นหาจริงเมื่อยาว >= 3 ตัวอักษร
  const effectiveSearchKeyword =
    debouncedSearchKeyword.length >= 3 ? debouncedSearchKeyword : ''

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [effectiveSearchKeyword])

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      // service layer แยก concern เรื่อง HTTP + normalize payload
      const payload = await listUsers({
        query: effectiveSearchKeyword,
        start: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      })

      setUsers(payload?.items ?? [])
      setTotal(payload?.total ?? 0)
      setTotalPages(Math.max(payload?.total_pages ?? 1, 1))
    } catch (error) {
      setUsers([])
      setTotal(0)
      setTotalPages(1)
      setErrorMessage(getErrorMessage(error, 'Cannot load users from API.'))
    } finally {
      setIsLoading(false)
    }
  }, [effectiveSearchKeyword, page])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers()
  }, [loadUsers])

  const pageButtons = useMemo(
    () => buildPageButtons(page, totalPages),
    [page, totalPages],
  )

  const clearSearch = () => {
    setSearchInput('')
  }

  const clearSuccessToast = useCallback(() => {
    setSuccessToastMessage('')
  }, [])

  const create = async (formData, closeModal) => {
    setIsCreating(true)

    try {
      await createUser({
        name: formData.name.trim(),
        age: Number(formData.age),
        email: formData.email.trim(),
        avatarUrl: formData.avatarUrl.trim(),
      })

      closeModal()
      if (page !== 1) {
        setPage(1)
      } else {
        await loadUsers()
      }

      setSuccessToastMessage('User created successfully.')
      return true
    } catch (error) {
      // restore flow: activate เฉพาะกรณี backend บอกว่าชน email ของ user ที่ถูกลบไปแล้ว
      const isDeletedFromError = Boolean(
        error instanceof ApiError &&
          error.status === 409 &&
          error.payload &&
          typeof error.payload === 'object' &&
          error.payload.detail &&
          typeof error.payload.detail === 'object' &&
          error.payload.detail.is_deleted === true,
      )

      if (
        error instanceof ApiError &&
        error.status === 409 &&
        isDeletedFromError
      ) {
        const shouldRestore = window.confirm(
          'This email already exists in the system. If it was previously deleted, you can restore it.\n\nClick OK to restore.',
        )

        if (shouldRestore) {
          try {
            await restoreUserByEmail(formData.email)
            window.alert('Restore user success.')
            closeModal()

            if (page !== 1) {
              setPage(1)
            } else {
              await loadUsers()
            }
            setSuccessToastMessage('User restored successfully.')
            return true
          } catch (restoreError) {
            window.alert(getErrorMessage(restoreError, 'Restore user failed.'))
            return false
          }
        }
      }

      window.alert(getErrorMessage(error, 'Create user failed.'))
      return false
    } finally {
      setIsCreating(false)
    }
  }

  const update = async (userId, formData) => {
    setIsSaving(true)
    setErrorMessage('')

    try {
      await updateUser(userId, {
        name: formData.name.trim(),
        age: Number(formData.age),
        email: formData.email.trim(),
        avatarUrl: formData.avatarUrl.trim(),
      })

      await loadUsers()
      setSuccessToastMessage('User updated successfully.')
      return true
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Update user failed.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const remove = async (userId) => {
    // confirm ก่อนลบจริง (safety UX)
    const accepted = window.confirm('Are you sure you want to remove this user?')
    if (!accepted) {
      return
    }

    setIsDeletingId(userId)
    setErrorMessage('')

    try {
      const payload = await deleteUser(userId)

      if (payload?.status === 'failed') {
        throw new Error(getApiErrorMessage(payload, 'Delete user failed.'))
      }

      const nextTotal = Math.max(total - 1, 0)
      const nextTotalPages = Math.max(Math.ceil(nextTotal / PAGE_SIZE), 1)
      const nextPage = Math.min(page, nextTotalPages)
      if (nextPage !== page) {
        setPage(nextPage)
      } else {
        await loadUsers()
      }
      setSuccessToastMessage('User removed successfully.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Delete user failed.'))
    } finally {
      setIsDeletingId(null)
    }
  }

  return {
    users,
    searchInput,
    setSearchInput,
    clearSearch,
    page,
    setPage,
    total,
    totalPages,
    pageButtons,
    isLoading,
    errorMessage,
    isCreating,
    isSaving,
    isDeletingId,
    successToastMessage,
    clearSuccessToast,
    create,
    update,
    remove,
  }
}
