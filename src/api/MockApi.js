import axios from 'axios';

export const fetchCountries = (endpoint) => {
  return new Promise((resolve, reject) => {
    axios.get(endpoint).then(response => {
      resolve(response.data);
    }).catch(error => reject(error));
  });
};