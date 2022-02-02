
import fetch from 'node-fetch';

function randomInt(max) { // min and max included 
  return Math.floor(Math.random() * max) + 1
}

// const rndInt = randomInt(355)
// console.log(rndInt)

async function fetchCollections() {
  const response = await fetch('https://howrare.is/api/v0.1/collections/');
  const collections = await response.json();
  const data = collections.result.data
  return data
  //console.log(response);
}

const collections = fetchCollections();
console.log(collections);

const collectionCount = Object.keys(collections).length;
console.log(collectionCount);


// function fetchCollectionNumber(){ fetchCollections().then(collections => {
//   return Object.keys(collections.result.data).length
// });}
// console.log(fetchCollectionNumber())

// const rndInt = randomInt(fetchCollectionNumber)

// fetchCollections().then(collections => {
//   console.log(collections.result.data[rndInt])
// });

// async function fetchMoviesJSON() {
//   const response = await fetch('/movies');
//   const movies = await response.json();
//   return movies;
// }
// fetchMoviesJSON().then(movies => {
//   movies; // fetched movies
// });