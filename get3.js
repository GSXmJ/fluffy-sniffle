import fetch from 'node-fetch';

const apiUrl = 'https://howrare.is/api/v0.1/collections/';

function randomInt(max) { // random number from 0 to max 
    return Math.floor(Math.random() * max)
  };

async function fetchWithTimeout(resource, options = {}) { //timeout function because default timeout is like 300 seconds
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  };

async function fetchCollections(apiAddress) {
    try {
      const response = await fetchWithTimeout(apiAddress, {
        timeout: 6000
      });
      const games = await response.json();
      return games;
    } catch (error) {
      // Timeouts if the request takes
      // longer than 6 seconds
      console.log(error.name === 'AbortError');
    }
  };

fetchCollections(apiUrl).then(collections => {
  const randomCollection = randomInt(Object.keys(collections.result.data).length)
  console.log(randomCollection)
  const collectionName = collections.result.data[randomCollection].name
  console.log(collectionName)
  const collectionUrl = collections.result.data[randomCollection].url
  console.log(collectionUrl)
});

