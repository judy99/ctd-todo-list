import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
import { useSearchParams, useNavigate } from 'react-router';
import Pagination from '../Pagination/Pagination';
import { useEffect } from 'react';

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  isLoading,
  isSearch,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemsPerPage = 5;
  let currentPage = parseInt(searchParams.get('page') || 1, 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  // uncompleted items on a page
  const slicedTodoList = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  let totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  useEffect(() => {
    // don’t redirect when data is empty
    if (totalPages > 0) {
      if (
        currentPage < 1 ||
        currentPage > totalPages ||
        Number.isNaN(currentPage)
      ) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  // if we search and nothing found
  if (isSearch && !slicedTodoList.length) {
    return <p>{'Nothing found...'}</p>;
  }

  return isLoading ? (
    <p>{'Todo list loading...'}</p>
  ) : slicedTodoList.length ? (
    <>
      <ul className={styles.todoList}>
        {slicedTodoList.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </>
  ) : (
    // if todo list is empty
    <p>{'Add todo above to get started'}</p>
  );
}

export default TodoList;
