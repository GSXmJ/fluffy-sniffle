import fetch from 'node-fetch'

const apiUrl = 'https://howrare.is/api/v0.1/collections'

function randomInt (max) { // random number from 0 to max
  return Math.floor(Math.random() * max)
};

async function fetchWithTimeout (resource, options = {}) {
  // timeout function for the first call because default timeout is like 300 seconds
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  })
  clearTimeout(id)
  return response
};

async function fetchCollection (targetAddress) {
  // keeping the timeout bit
  try {
    const response = await fetchWithTimeout(targetAddress, {
      timeout: 2000
    })
    const getResponse = await response.json()
    const responseData = getResponse.result.data
    const dataLength = Object.keys(getResponse.result.data).length
    return { responseData, dataLength }
  } catch (error) {
    // Timeouts if the request takes
    // longer than 6 seconds
    throw new Error('aborted because initial request took too long')
  }
};

async function fetchJpegs (urls) {
  try {
    const jpegs = [] // empty list

    const requests = urls.map((url) => fetch(url))
    const responses = await Promise.all(requests)
    const errors = responses.filter((response) => !response.ok)

    if (errors.length > 0) {
      throw errors.map((response) => Error(response.statusText))
    }

    const json = responses.map((response) => response.json())
    const data = await Promise.all(json)

    // loop the data
    data.forEach((datum) => {
      // select random number from number of keys
      const selectRandom = randomInt(Object.keys(datum.result.data.items).length)
      // add that random numbered jpeg to list
      jpegs.push(datum.result.data.items[selectRandom].image)
    }
    )
    // return list of jpeg addresses
    return jpegs
  } catch (errors) {
    errors.forEach((error) => console.error(error))
  }
};

async function main () {
  const arg = process.argv.slice(2)
  // console.log(arg)
  const loopCount = parseInt(arg)
  const randomCollectionNames = []
  const randomCollectionUrls = []

  const collections = await fetchCollection(apiUrl)

  // loop to get collection names and urls
  for (let i = 0; i < loopCount; i++) {
    const randomCollection = randomInt(collections.dataLength)

    randomCollectionNames.push(collections.responseData[randomCollection].name)
    randomCollectionUrls.push(apiUrl + collections.responseData[randomCollection].url)
  }

  // get all the jpegs
  const jpegList = await fetchJpegs(randomCollectionUrls)

  // this is how you map two lists together
  const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]])

  console.log(zip(randomCollectionNames, jpegList))
}

main()
