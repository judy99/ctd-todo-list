import { useEffect, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const TodosViewForm = ({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) => {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  const handleChangeSortField = (e) => {
    setSortField(e.target.value);
  };

  const handleChangeSortDir = (e) => {
    setSortDirection(e.target.value);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  // prevent the page from refreshing if a user accidentally
  // hits enter while working with this form
  const preventRefresh = (e) => {
    e.preventDefault();
  };

  return (
    <StyledFormViewWrapper>
      <form id="todoViewForm" onSubmit={preventRefresh}>
        <StyledSearch>
          <TextInputWithLabel
            elementId={'todoSearch'}
            onChange={(e) => setLocalQueryString(e.target.value)}
            value={localQueryString}
            placeholder={'Search by title...'}
          />
          <button
            type="button"
            className="formButton"
            onClick={() => setLocalQueryString('')}
          >
            Clear
          </button>
        </StyledSearch>
        <StyledSortWrapper>
          <StyledSort>
            <label htmlFor="sortBy">Sort by: </label>
            <select
              name="sortBy"
              onChange={handleChangeSortField}
              value={sortField}
            >
              <option value="title">Title</option>
              <option value="createdTime">Time added</option>
            </select>
          </StyledSort>
          <StyledSort>
            <label htmlFor="sortDir">Direction: </label>
            <select
              name="sortDir"
              onChange={handleChangeSortDir}
              value={sortDirection}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </StyledSort>
        </StyledSortWrapper>
      </form>
    </StyledFormViewWrapper>
  );
};

const StyledFormViewWrapper = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
`

const StyledSortWrapper = styled.div`
  display: flex;
`;

const StyledSort = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 200px;
  margin-right: 20px;

  label {
    margin-right: 10px;
  }

  select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
`;

const StyledSearch = styled.div`
  padding-bottom: 20px;
  display: flex;

  >div {
    flex-grow: 1;
  }
`;

export default TodosViewForm;