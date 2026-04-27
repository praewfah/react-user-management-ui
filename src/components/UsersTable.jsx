import { applyDefaultAvatar, getAvatarSrc } from '../utils/avatar'

/**
 * UsersTable แสดง 3 สถานะหลัก:
 * 1) loading
 * 2) empty result
 * 3) data rows
 *
 * ตารางนี้ไม่รู้เรื่อง API โดยตรง รับข้อมูลสำเร็จรูปจาก hook/page
 */
function UsersTable({ users, isLoading, isDeletingId, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="message">
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="5" className="message">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    className="avatar"
                    src={getAvatarSrc(user.avatarUrl)}
                    alt={user.name}
                    loading="lazy"
                    onError={applyDefaultAvatar}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.email}</td>
                <td>
                  <div className="actions">
                    <button type="button" onClick={() => onEdit(user)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete(user.id)}
                      disabled={isDeletingId === user.id}
                    >
                      {isDeletingId === user.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
