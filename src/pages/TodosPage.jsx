import styles from '../App.module.css';
import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';
import { useState } from 'react';

export default function TodosPage({
  todoState,
  dispatch,
  todoActions,
  addTodo,
  completeTodo,
  updateTodo,
  searchParams,
  setSearchParams,
  offset,
  setOffset
}) {
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );

  const [prevOffset, setPrevOffset] = useState(offset);
  //will be updated with API response
  const itemsPerPage = 5;
  // const currentPage = parseInt(searchParams.get('page') || '1', 10);
  // const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(todoState.todoList.length / itemsPerPage);

  const handleNextPage = () => {
    //only page forward if it is not the last page
    // if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
    setPrevOffset(offset)
    setSearchParams({
      ...searchParams,
      page: currentPage,
      pageSize: itemsPerPage,
    });
    // }
  };

  const handlePreviousPage = () => {
    //only page forward if it is not the first page
    setCurrentPage((prev) => prev - 1);
    setOffset(prevOffset);
    setSearchParams({
      ...searchParams,
      page: currentPage,
      pageSize: itemsPerPage,
      offset
    });
    // }
  };

  return (
    <>
      <TodosViewForm todo={todoState} dispatch={dispatch} />
      {todoState.errorMessage.length ? (
        <div className={styles.errorWrapper}>
          <div className={styles.error}>
            <p>Error: {todoState.errorMessage}</p>
            <button
              className="formButton"
              type="button"
              onClick={() => dispatch({ type: todoActions.clearError })}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <div className="paginationControls">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <span>Page: {currentPage}</span>
        <button type="button" disabled={!offset} onClick={handleNextPage}>
          Next
        </button>
      </div>
    </>
  );
}
