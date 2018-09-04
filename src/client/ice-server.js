/* global fetch */

export const fetchIceServers = async (turnApiUrl) => {
  const response = await fetch(turnApiUrl, {
    method: 'PUT'
  })

  if (response.status >= 300) {
    throw new Error('TURN API return unexpected status ' + response.status)
  }

  const result = await response.json()
  const { iceServers = [] } = result.v

  return iceServers
}
