/**
 * Page component นี้ทำหน้าที่ "ประกอบหน้าจอ" (composition/orchestration)
 * โดยแยก business logic ไปที่ hook (useUsers) และแยกการแสดงผลไปที่ components ย่อย
 */
import { useEffect, useState } from 'react'
import CreateUserModal from '../components/CreateUserModal'
import EditUserModal from '../components/EditUserModal'
import PaginationControls from '../components/PaginationControls'
import SearchToolbar from '../components/SearchToolbar'
import UsersTable from '../components/UsersTable'
import useUsers from '../hooks/useUsers'
import './UserManagementPage.css'

function UserManagementPage() {
  // UI state เฉพาะระดับหน้า (เปิด/ปิด modal)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  /**
   * useUsers = use-case layer ของหน้านี้
   * คืนทั้ง "state" และ "actions" ที่พร้อมใช้งานใน UI
   */
  const {
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
  } = useUsers()

  useEffect(() => {
    // แสดง toast ชั่วคราว แล้วซ่อนอัตโนมัติ
    if (successToastMessage === '') {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      clearSuccessToast()
    }, 2500)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [successToastMessage, clearSuccessToast])

  return (
    <main className="page">
      <header className="page-header">
        <h1>User Management</h1>
        <p>React front-end connected to user-management-api.</p>
      </header>

      <section className="panel">
        <SearchToolbar
          searchInput={searchInput}
          onChangeSearch={setSearchInput}
          onClearSearch={clearSearch}
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />

        <UsersTable
          users={users}
          isLoading={isLoading}
          isDeletingId={isDeletingId}
          onEdit={setEditingUser}
          onDelete={remove}
        />

        <PaginationControls
          total={total}
          page={page}
          totalPages={totalPages}
          pageButtons={pageButtons}
          onChangePage={setPage}
        />

        {errorMessage !== '' ? (
          <p className="error-text" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </section>

      <EditUserModal
        user={editingUser}
        isSubmitting={isSaving}
        onClose={() => setEditingUser(null)}
        onSubmit={update}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        isSubmitting={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(formData) => create(formData, () => setIsCreateModalOpen(false))}
      />

      {successToastMessage !== '' ? (
        <div className="success-toast" role="status" aria-live="polite">
          {successToastMessage}
        </div>
      ) : null}
    </main>
  )
}

export default UserManagementPage
