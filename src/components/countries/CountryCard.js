import React, { useEffect } from 'react';

const CountryCard = ({ capital, name, subregion, population, flag, languages}) => {

  useEffect(() => {
  }, [])

  return (
    <div className="country_card">
      <div className="flag-cover">
        <img alt="flag" src={flag} />
      </div>
      <h3>{name}</h3>
      <p>Capital: {capital}</p>
      <p>Subregion: {subregion}</p>
      <p>Total Population: {population}</p>
      <p>Languages: {languages}</p>
    </div>
  )
}

export default CountryCard;
