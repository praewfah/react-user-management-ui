/**
 * SearchToolbar = presentational component
 * - รับค่าจาก parent ผ่าน props
 * - ไม่เรียก API เอง
 * - ไม่ถือ business state ของระบบ
 */
function SearchToolbar({
  searchInput,
  onChangeSearch,
  onClearSearch,
  onOpenCreate,
}) {
  return (
    // ใช้ form เพื่อให้ semantics ถูกต้อง แต่ปิด submit จริง (ค้นหาแบบ onChange + debounce)
    <form className="search-row" onSubmit={(event) => event.preventDefault()}>
      <div className="search-input-block">
        <div className="search-input-row">
          <input
            type="text"
            placeholder="Search by name or email (min 3 characters)"
            value={searchInput}
            onChange={(event) => onChangeSearch(event.target.value)}
            aria-label="Search users"
          />
          {searchInput !== '' ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={onClearSearch}
              aria-label="Clear search"
            >
              x
            </button>
          ) : null}
        </div>
        <span className="hint-text">
          Auto search after typing stops for 400ms (minimum 3 characters)
        </span>
      </div>
      <div className="search-actions">
        <button type="button" onClick={onOpenCreate}>
          Create User
        </button>
      </div>
    </form>
  )
}

export default SearchToolbar
