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

function pipe (source, target) { // para que cada uno de los eventos del agent de monitoreo sea redistribuido a socket.io sin tener que agregar listeners por cada uno de los eventos
  if (!source.emit || !target.emit) {
    throw TypeError(`Please pass EventEmmiter's as arguments`)
  }

  const emit = source._emit = source.emit

  source.emit = function () {
    emit.apply(source, arguments)
    target.emit.apply(target, arguments)
    return source
  }
}

module.exports = {
  parsePayload,
  pipe
}
