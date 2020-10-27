import React, { useEffect, useState } from 'react';
import CountryCard from './CountryCard'
import {fetchCountries} from '../../api/MockApi'
import './Country.scss';

function CountryContainer(props) {
  const [countries, setCountries] = useState([]);
  const [cachedCountries, setCachedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subregionFilterVal, setSubregionFilterVal] = useState("");
  const [languageFilterVal, setLanguageFilterVal] = useState("");
  const [error, setError] = useState('');

  let mainContent

  //on load
  useEffect(() => {
    initApp();
  }, []);


  function initApp() {
    // this is hit API to setState on countries
    fetchCountries('https://restcountries.eu/rest/v2/region/europe')
      .then(response => {
        setCountries(response);
        setSubregionFilterVal("");
        setLanguageFilterVal("");
        setLoading(true);
        setCachedCountries(response);
      })
      .catch(error => {
        setError(error.message);
        setLoading(true)
      })
  }

// utility to lowers case and remove diacritics for comparing. tricky ---- getting rid of the diacritics which interfere with the alphanumeric sorting. å not equal to a, for instance
  function cleanWord(word) {
    let diacritics = {
      '-': '_|-',
      'a': 'å|á|à|ã|â|À|Á|Ã|Â',
      'e': 'é|è|ê|É|È|Ê',
      'i': 'í|ì|î|Í|Ì|Î',
      'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      'c': 'ç|Ç',
      'n': 'ñ|Ñ'
    }

    for (var pattern in diacritics) {
      word = word.replace(new RegExp(diacritics[pattern], 'g'), pattern).toLowerCase()
    }
    return word
  }
  // dynamic sort function for reusability
  function compareAndOrder(key, order = 'asc') {
    return function checkProps(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      // check to see if string comparision. set vars to compare
      let countryA = (typeof a[key] === 'string') ? cleanWord(a[key]) : a[key];
      let countryB = (typeof b[key] === 'string') ? cleanWord(b[key]) : b[key];

      //compare and order
      let comparison = 0;
      if (countryA > countryB) {
        comparison = 1;
      } else if (countryA < countryB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  function sortCountries(key, order) {
    let sortedArray = countries.sort(compareAndOrder(key, order));
    setCountries([...sortedArray]);
  };

  function filterByLanguages(filterKey, filterValue) {
    let filteredCountries
    let filterValueNum = parseInt(filterValue)
    if (subregionFilterVal) {
      filteredCountries = cachedCountries.filter(country => country.languages.length === filterValueNum && country.subregion === subregionFilterVal)

    } else {
      filteredCountries = cachedCountries.filter(country => country.languages.length === filterValueNum)
    }

    setLanguageFilterVal(filterValue);
    setCountries([...filteredCountries]);
  }

  function filterBySubregion(filterKey, filterValue) {
    let filteredCountries
    if (languageFilterVal) {
      filteredCountries = cachedCountries.filter(country => country.subregion === filterValue && country.languages.length === parseInt(languageFilterVal) )
    } else {
      filteredCountries = cachedCountries.filter(country => country.subregion === filterValue)
    }
    setSubregionFilterVal(filterValue);
    setCountries([...filteredCountries]);
  }

  if (loading) {
    renderCountries(countries);
  } else {
    renderLoader();
  }

  function renderCountries(countries) {
    mainContent =
      <div className="countries-container">{error ? <div>{error.message}</div> :
        countries.
        map((country) =>
          <CountryCard
            key={country.numericCode}
            name={country.name}
            capital={country.capital}
            flag={country.flag}
            subregion={country.subregion}
            population={country.population}
            languages={country.languages.length}
          />
        )}
      </div>;
  }

  function renderLoader() {
    return <div>Loading...</div>
  }

// set filter option and sort menu arrays
  let uniqueLanguageCounts = [...new Set(cachedCountries.map(item => item.languages.length))];
  let uniqueSubregions = [...new Set(cachedCountries.map(item => item.subregion))];


  let options =  [{
    label: 'Sort By . . .',
      value: "null",
      },
  {
    label: 'Name',
      value: 'name',
      },
  {
    label: 'Population',
    value: 'population',
      }
    ]

  return (
    <div className="app-container">
      <div className="filter-sort-bar">
        <button onClick={() => sortCountries('name')}>Sort Name Asc</button>
        <button onClick={() => sortCountries('name', 'desc')}>Sort Name Desc</button>
        <button onClick={() => sortCountries('population')}>Sort Population </button>
        <button onClick={() => sortCountries('population', 'desc')}>Sort Population Desc</button>
        <select onChange={(e) => filterByLanguages("languages", e.target.value)} value={languageFilterVal} default="filter">
          <option value="none">
            Spoken Languages
          </option>
          {uniqueLanguageCounts.sort().map(lang => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <select onChange={(e) => filterBySubregion("subregion", e.target.value)} value={subregionFilterVal} default="filter">
          <option value="none">
            Subregions
          </option>
          {uniqueSubregions.map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <button onClick={initApp}>Reset</button>   
      </div>
        {mainContent}
    </div>
  );
};

export default CountryContainer
