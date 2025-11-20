import React, { useEffect, useRef, useState } from 'react';
import { data } from 'react-router-dom';

type getPeopleFn = (
  search: string,
  page: number,
  options: Record<string, any>
) => any;

interface personResponse {
  birth_year: string;
  created: string;
  edited: string;
  eye_color: string;
  films: string[]; //url
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  species: string[];
  starships?: [];
  url: string;
  vehicles?: string[];
}

function getPeople(search: string, page = 1, options = {}) {
  return fetch(
    `https://swapi.dev/api/people?search=${search}&page=${page}`,
    options
  )
    .then((result) => result.json())
    .then((data) => data);
}

function debounce(fn: (e: string) => void, delay: number) {
  let timeoutId: undefined | number;
  return function (args: string) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(args);
    }, delay);
  };
}

export function StarWarsFetch() {
  const [listPepole, setListPeople] = useState<null | personResponse[]>();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getPeople(inputValue).then((data) => {
      setListPeople(data.results);
      setIsLoading(false);
    });

    console.log(listPepole);
  }, [inputValue]);

  //   function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
  //     setIsLoading(true);
  //     const inputText = e.target.value;
  //     setInputValue(inputText);
  //     console.log('😇', inputText);
  //   }

  function handleInput(value: string) {
    setIsLoading(true);

    setInputValue(value);
  }

  const debounceHandleInput = debounce(handleInput, 2000);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    debounceHandleInput(e.target.value);
  }

  return (
    <div>
      Write name
      <input type="string" placeholder="skywoker" onChange={handleChange} />
      {isLoading && <div>...loading</div>}
      {!isLoading && listPepole?.length === 0 && <div> find nothing </div>}
      {listPepole && listPepole.length > 0 && (
        <ul>
          {' '}
          {listPepole?.map((personObj, id) => {
            return <li key={id}>{personObj.name}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
