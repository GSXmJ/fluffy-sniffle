import fetch from 'node-fetch'

const apiUrl = 'https://howrare.is/api/v0.1/collections'

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

async function fetchCollections (urls) {
  try {
    const requests = urls.map((urls) => fetchWithTimeout(urls, {
      timeout: 2000
    }))
    const responses = await Promise.all(requests)
    const errors = responses.filter((response) => !response.ok)

    if (errors.length > 0) {
      // throw errors.map((response) => Error(response.statusText))
      throw new Error('aborted because initial request took too long')
    }

    const json = responses.map((response) => response.json())
    const data = await Promise.all(json)

    return data
  } catch (errors) {
    errors.forEach((error) => console.error(error))
  }
};

function formatting (data, range) {
  const name = data.result.data.collection
  const jpegs = []
  for (let i = 0; i < range; i++) {
    jpegs.push(data.result.data.items[i].image)
  }
  // console.log({ name, jpegs })
  console.log(typeof name)
  return { [name]: jpegs }
  // console.log(jpegs)
}

async function main () {
  const arg = process.argv.slice(2)
  console.log(arg)
  const args = []

  arg.forEach(element => {
    args.push(apiUrl + '/' + element)
  })

  console.log(args)
  const data = await fetchCollections(args)
  // console.log(data)

  const amounts = []
  data.forEach((datum) => {
    // select random number from number of keys
    amounts.push(Object.keys(datum.result.data.items).length)
  }
  )
  const lowestCommonAmount = Math.min(...amounts)
  // const lowestCommonAmount = 4
  console.log(lowestCommonAmount)

  const result = []
  data.forEach((datum) => {
    // select random number from number of keys
    result.push(formatting(datum, lowestCommonAmount))
  }
  )
  console.log(result)
}

main()
