import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
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
  }, []);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
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

    const payload = {
      records: [
        {
          id,
          fields: {
            title: originalTodo.title,
            isCompleted: !originalTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    // optimistic update
    setTodoList([...updatedTodos]);

    try {
      const resp = await fetch(url, options);
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

    const payload = {
      records: [
        {
          id: updatedTodo.id,
          fields: {
            title: updatedTodo.title,
            isCompleted: updatedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    // optimistic update
    setTodoList([...updatedTodoList]);

    try {
      const resp = await fetch(url, options);
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
      {errorMessage.length ? (
        <div>
          <hr />
          <p>Error: {errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage('')}>
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
