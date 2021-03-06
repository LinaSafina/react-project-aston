import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Wrapper from '../components/Layout/Wrapper';
import searchAll from '../constants/searchAll';

const HomePage = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const submitSearchHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredSearchValue = searchInputRef.current!.value;

    navigate(
      `/search?search=${
        enteredSearchValue || searchAll
      }&copyright=${searchAll}&languages=${searchAll}&page=1`
    );
  };

  return (
    <Wrapper>
      <div className='homepage'>
        <h2 className='homepage__title'>SEARCH THE CATALOG</h2>
        <form className='homepage__form' onSubmit={submitSearchHandler}>
          <div className='form__control'>
            <input className='input' ref={searchInputRef} />
          </div>
          <div className='form__action'>
            <button type='submit' className='button'>
              Search
            </button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default HomePage;
