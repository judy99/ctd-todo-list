const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: '',
  isSaving: false,
  sortDirection: 'desc',
  sortField: 'createdTime',
  queryString: '',
};

const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
  // change sort direction in TodosViewForm
  changeSortDirection: 'changSortDirection',
  // change sort field in TodosViewForm
  changeSortField: 'changeSortField',
  // change query string
  changeQueryString: 'changeQueryString',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // Pessimistic UI for fetching
    // fetchTodos, loadTodos, setLoadError
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case actions.loadTodos:
      const todos = action.records.map((record) => {
        const item = {
          id: record.id,
          ...record.fields,
        };
        if (!item.isCompleted) {
          item.isCompleted = false;
        }
        return item;
      });

      return {
        ...state,
        todoList: [...todos],
        isLoading: false,
      };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.errorMessage,
        isLoading: false,
      };

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    // add todos (pessimistic UI)
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.endRequest:
      return {
        ...state,
        isSaving: false,
        isLoading: false,
      };

    case actions.addTodo:
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      // Airtable does not return false or empty fields
      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        isSaving: false,
        todoList: [...state.todoList, savedTodo],
      };

    // updateTodo, completeTodo (Optimistic UI)
    case actions.revertTodo:
    case actions.updateTodo:
      const updatedTodoList = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? action.editedTodo : todo
      );
      const updatedState = {
        ...state,
        todoList: [...updatedTodoList],
        errorMessage: action.errorMessage ? action.errorMessage : '',
      };
      return {
        ...updatedState,
      };

    case actions.completeTodo:
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );
      return {
        ...state,
        todoList: [...updatedTodos],
      };

    case actions.changeSortField:
      return {
        ...state,
        sortField: action.sortField,
      };

    case actions.changeSortDirection:
      return {
        ...state,
        sortDirection: action.sortDirection,
      };

    case actions.changeQueryString:
      return {
        ...state,
        queryString: action.queryString,
      };
  }
}

export { initialState, actions, reducer };
