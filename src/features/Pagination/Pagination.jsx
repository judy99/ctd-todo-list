import styles from './Pagination.module.css';

export default function Pagination({
  setSearchParams,
  totalPages,
  currentPage,
}) {
  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setSearchParams({
        page: currentPage + 1,
      });
    } else {
      setSearchParams({
        page: totalPages,
      });
    }
  };
  const handlePreviousPage = () => {
    if (currentPage - 1 >= 1) {
      setSearchParams({
        page: currentPage - 1,
      });
    } else {
      setSearchParams({
        page: 1,
      });
    }
  };

  return (
    <div className={styles.paginationControls}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
        className='formButton'
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
        className='formButton'
      >
        Next
      </button>
    </div>
  );
}
