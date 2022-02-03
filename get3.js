import fetch from 'node-fetch'

const apiUrl = 'https://howrare.is/api/v0.1/collections'

function randomInt (max) { // random number from 0 to max
  return Math.floor(Math.random() * max)
};

async function fetchWithTimeout (resource, options = {}) { // timeout function because default timeout is like 300 seconds
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

async function fetchJson (targetAddress, collection) {
  try {
    const response = await fetchWithTimeout(targetAddress, {
      timeout: 6000
    })
    const getResponse = await response.json()
    const responseData = getResponse.result.data
    let dataLength
    if (collection) {
      dataLength = Object.keys(getResponse.result.data).length
    } else {
      dataLength = Object.keys(getResponse.result.data.items).length
    }
    return { responseData, dataLength }
  } catch (error) {
    // Timeouts if the request takes
    // longer than 6 seconds
    console.log(error.name === 'AbortError')
  }
};

async function main () {
  const arg = process.argv.slice(2)
  console.log(arg)
  const loopCount = parseInt(arg)
  const list = []

  const collections = await fetchJson(apiUrl, true)

  for (let i = 0; i < loopCount; i++) {
    const randomCollection = randomInt(collections.dataLength)

    const collectionName = collections.responseData[randomCollection].name
    const collectionUrl = collections.responseData[randomCollection].url
    // console.log(apiUrl+collectionUrl)

    const jpegs = await fetchJson(apiUrl + collectionUrl, false)

    const randomJpeg = randomInt(jpegs.dataLength)
    // console.log(randomJpeg)
    const jpegUrl = jpegs.responseData.items[randomJpeg].image
    // console.log(jpegUrl)

    const result = { collectionName, jpegUrl }

    list.push(result)
  }

  console.log(list)
}

main()
