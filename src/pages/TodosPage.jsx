import styles from '../App.module.css';
import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';

export default function TodosPage({
  todoState,
  dispatch,
  todoActions,
  addTodo,
  completeTodo,
  updateTodo,
}) {
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
    </>
  );
}
