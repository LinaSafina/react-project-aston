import { useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import useFetch from '../hooks/use-fetch';
import { historyActions } from '../store/history-slice';
import BookList from '../components/BookList';
import Loading from '../components/Layout/Loading';
import Wrapper from '../components/Layout/Wrapper';
import SearchForm from '../components/SearchForm';
import searchAll from '../constants/search-all';
import ErrorBoundary from '../components/ErrorBoundary';

const Search = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const queryParam = (param) => {
    const queryParam = searchParams.get(param);
    return (
      (queryParam && queryParam !== searchAll && `${param}=${queryParam}&`) ||
      ''
    );
  };

  const query =
    '?' +
    queryParam('search') +
    queryParam('languages') +
    queryParam('copyright') +
    queryParam('page');

  const { fetchBooksHandler, data, isLoading, error } = useFetch(query);
  const books = data?.results;
  const count = data?.count;

  useEffect(() => {
    const fetchData = async () => await fetchBooksHandler();
    fetchData();
    dispatch(historyActions.add(Object.fromEntries([...searchParams])));
  }, [fetchBooksHandler, searchParams, dispatch]);

  let content = (
    <p className='info'>
      Sorry, we couldn't find any books. Change the search parameters and try
      again.
    </p>
  );

  if (books?.length > 0) {
    content = <BookList books={books} />;
  }

  if (isLoading) {
    content = <Loading />;
  }

  if (error) {
    content = <p className='info'>{error}</p>;
  }

  return (
    <Wrapper>
      <div className='search-page'>
        <SearchForm
          defaultValues={{
            search: searchParams.get('search'),
            languages: searchParams.get('languages'),
            copyright: searchParams.get('copyright'),
          }}
        />

        <p className='search-results'>
          We have found <span className='bold'>{count}</span> books
        </p>

        <Fragment>{content}</Fragment>
      </div>
    </Wrapper>
  );
};

export default Search;
