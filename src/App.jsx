import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useEffect, useCallback } from 'react';

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
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortField, setSortField] = useState('createdTime');
  const [queryString, setQueryString] = useState('');

  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = getOptions('GET', token);
      try {
        const url = encodeUrl();
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.message || 'Something went wrong!');
        }
        const { records } = await resp.json();
        const todos = records.map((record) => {
          const item = {
            id: record.id,
            ...record.fields,
          };
          if (!item.isCompleted) {
            item.isCompleted = false;
          }
          return item;
        });
        setTodoList([...todos]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  const addTodo = async (newTodo) => {
    const payload = createPayload(newTodo);
    const options = getOptions('POST', token, payload);
    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) throw new Error(resp.message || 'Something went wrong!');
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      // Airtable does not return false or empty fields
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );

    const payload = createPayload({
      ...originalTodo,
      isCompleted: !originalTodo.isCompleted,
    });

    const options = getOptions('PATCH', token, payload);

    // optimistic update
    setTodoList([...updatedTodos]);

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.log('error while updating:', error.message);
      setErrorMessage(`${error.message}. Reverting comlete todo...`);
      const revertedTodos = todoList.map((todo) =>
        todo.id === id ? originalTodo : todo
      );
      setTodoList([...revertedTodos]);
    }
  };

  const updateTodo = async (updatedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === updatedTodo.id);
    const updatedTodoList = todoList.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );

    const payload = createPayload(updatedTodo);
    const options = getOptions('PATCH', token, payload);

    // optimistic update
    setTodoList([...updatedTodoList]);

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.log('error while updating:', error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) =>
        todo.id === updateTodo.id ? originalTodo : todo
      );
      setTodoList([...revertedTodos]);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <footer>
        <TodosViewForm
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />
        {errorMessage.length ? (
          <div>
            <hr />
            <p>Error: {errorMessage}</p>
            <button type="button" onClick={() => setErrorMessage('')}>
              Dismiss
            </button>
          </div>
        ) : null}
      </footer>
    </div>
  );
}

export default App;
