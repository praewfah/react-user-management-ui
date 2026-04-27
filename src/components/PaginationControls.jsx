/**
 * PaginationControls รับ page model ที่คำนวณไว้แล้วจาก hook
 * component นี้ทำหน้าที่ render ปุ่มและส่งเลขหน้าที่ผู้ใช้เลือกกลับไปยัง parent เท่านั้น
 */
function PaginationControls({ total, page, totalPages, pageButtons, onChangePage }) {
  return (
    <footer className="pagination-row">
      <span>{`Total: ${total} users`}</span>
      <div className="pagination">
        <button
          type="button"
          onClick={() => onChangePage(Math.max(page - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        {pageButtons.map((value, index) =>
          value === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={value}
              type="button"
              className={value === page ? 'active' : ''}
              onClick={() => onChangePage(value)}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChangePage(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </footer>
  )
}

export default PaginationControls
