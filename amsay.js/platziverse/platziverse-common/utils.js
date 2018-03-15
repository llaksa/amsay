'use strict'

function parsePayload (payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf8') // garantizamos que tengamos un string
  }

  try {
    payload = JSON.parse(payload) // en caso nos pasen un string pero que no sea JSON
  } catch (e) {
    payload = {}
  }
  return payload
}

module.exports = {
  parsePayload
}
