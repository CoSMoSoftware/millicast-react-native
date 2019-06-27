/* global fetch */

export const fetchDirector = async (baseURL, type, payload, token) => {
  let options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  let url = `${baseURL}/${type}`

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, options)

  if (response.status >= 300) {
    throw new Error('Director API return status ' + JSON.stringify(payload) + response.status + JSON.stringify(response))
  }

  const result = await response.json()
  return `${result.data.wsUrl}?token=${result.data.jwt}`
}
