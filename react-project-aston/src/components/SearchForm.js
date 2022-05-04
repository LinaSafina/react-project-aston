import { useState, useCallback, useEffect } from 'react';
import {
  useNavigate,
  createSearchParams,
  useSearchParams,
} from 'react-router-dom';
import debounce from 'lodash.debounce';

import searchAll from '../constants/searchAll';

let isFirstLoading = true;

const SearchForm = (props) => {
  const navigate = useNavigate();
  const { search, languages, copyright } = props.defaultValues;
  const [searchInput, setSearchInput] = useState(search);
  const [langInput, setLangInput] = useState(languages);
  const [copyrightInput, setCopyrightInput] = useState(copyright);
  const [searchParams] = useSearchParams();

  const submitFormHandler = (e) => {
    e.preventDefault();
  };

  const delayedSearchHandler = useCallback(() => {
    const newSearchParams = createSearchParams({
      search: searchInput,
      copyright: copyrightInput,
      languages: langInput,
      page: searchParams.get('page') || 1,
    }).toString();

    if (searchParams.toString() === newSearchParams) {
      return;
    }

    navigate({
      pathname: '',
      search: newSearchParams,
    });
  },[copyrightInput,langInput,navigate,searchInput, searchParams]);

  const delayedSearch = useCallback(debounce(delayedSearchHandler, 1000), [
    searchInput,
    langInput,
    copyrightInput,
  ]);

  const changeInputHandler = (e) => {
    setSearchInput(e.target.value);
  };
  const changeLangHandler = (e) => {
    setLangInput(e.target.value);
  };
  const changeCopyrightHandler = (e) => {
    setCopyrightInput(e.target.value);
  };

  useEffect(() => {
    if (isFirstLoading) {
      isFirstLoading = false;

      return;
    }

    delayedSearch();

    return delayedSearch.cancel;
  }, [searchInput, langInput, copyrightInput, delayedSearch]);

  return (
    <form className='form search-form' onSubmit={submitFormHandler}>
      <div className='form__control'>
        <input value={searchInput} onChange={changeInputHandler} />
      </div>
      <div className='form__control'>
        <select value={langInput} onChange={changeLangHandler}>
          <option disabled>Language</option>
          <option value={searchAll}>All</option>
          <option value='en'>English</option>
          <option value='fr'>French</option>
        </select>
      </div>
      <div className='form__control'>
        <select value={copyrightInput} onChange={changeCopyrightHandler}>
          <option disabled>Copyright</option>
          <option value={searchAll}>all</option>
          <option value='true'>yes</option>
          <option value='false'>no</option>
        </select>
      </div>
    </form>
  );
};

export default SearchForm;
