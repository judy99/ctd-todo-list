import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import styles from './App.module.css';

import { useEffect, useCallback, useReducer } from 'react';

function createPayload({ id, title, isCompleted }) {
  const record = {
    fields: {
      title,
      isCompleted,
    },
  };

  if (id !== undefined) {
    record.id = id;
  }

  if (isCompleted === undefined) {
    record.fields.isCompleted = false;
  }

  return {
    records: [record],
  };
}

function getOptions(method, token, payload) {
  return method === 'GET'
    ? {
        method,
        headers: { Authorization: token },
      }
    : {
        method,
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      };
}
function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
    if (todoState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [todoState.sortField, todoState.sortDirection, todoState.queryString]);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos, isLoading: true });
      const options = getOptions('GET', token);
      try {
        const url = encodeUrl();
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.message || 'Something went wrong!');
        }
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          errorMessage: error.message,
        });
      } finally {
        dispatch({ type: todoActions.fetchTodos, isLoading: false });
      }
    };
    fetchTodos();
  }, [todoState.sortField, todoState.sortDirection, todoState.queryString]);

  const addTodo = async (newTodo) => {
    const payload = createPayload(newTodo);
    const options = getOptions('POST', token, payload);
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) throw new Error(resp.message || 'Something went wrong!');
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, errorMessage: error.message });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    dispatch({ type: todoActions.completeTodo, id });
    const updatedTodo = { ...originalTodo, isCompleted: true };
    const payload = createPayload(updatedTodo);
    const options = getOptions('PATCH', token, payload);

    // optimistic update
    try {
      const resp = await fetch(encodeUrl(), options, payload);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        errorMessage: `${error.message}. Reverting todo...`,
        editedTodo: originalTodo,
      });
    }
  };

  const updateTodo = async (updatedTodo) => {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === updatedTodo.id
    );
    const payload = createPayload(updatedTodo);
    const options = getOptions('PATCH', token, payload);

    // optimistic update
    dispatch({ type: todoActions.updateTodo, editedTodo: updatedTodo });

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        errorMessage: `${error.message}. Reverting todo...`,
        editedTodo: originalTodo,
      });
    }
  };

  return (
    <div className={styles.appWrapper}>
      <header>
        <h1 className={styles.mainTitle}>My Todos</h1>
      </header>
      <main>
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
      </main>
      <footer>
        <p>
          &copy; <span className={styles.currentYear}>{currentYear}</span>
          My Todo List
        </p>
      </footer>
    </div>
  );
}

export default App;
